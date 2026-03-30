export const analyzeWithClaude = async (title, content) => {
  const sentences = content?.split('. ')
    .map(s => s.trim())
    .filter(s => s.length > 20) || [];

  const total = sentences.length;
  const chunk = Math.max(1, Math.floor(total / 5));

  const overview = sentences.slice(0, Math.min(3, total)).join('. ') + '.';

  const highlights = sentences.slice(0, Math.min(chunk * 2, total))
    .filter(s => s.length > 30)
    .slice(0, 4)
    .map(s => s.length > 120 ? s.slice(0, 120) + '...' : s);

  const details = sentences.slice(Math.min(chunk, total - 1), Math.min(chunk * 3, total))
    .filter(s => s.length > 30)
    .slice(0, 4)
    .map(s => s.length > 120 ? s.slice(0, 120) + '...' : s);

  const history = sentences.slice(Math.min(chunk * 2, total - 1), Math.min(chunk * 4, total))
    .join('. ') + '.';

  const facts = sentences
    .filter(s => s.match(/\d|first|largest|oldest|known|famous|notable|founded|established/i))
    .slice(0, 4)
    .map(s => s.length > 120 ? s.slice(0, 120) + '...' : s);

  const allWords = content?.split(' ') || [];
  const summary = allWords.slice(0, 200).join(' ') + (allWords.length > 200 ? '...' : '');

  return {
    overview,
    highlights: highlights.length > 0 ? highlights : [overview],
    important_details: details.length > 0 ? details : sentences.slice(0, 3).map(s => s.slice(0, 120)),
    history: history.length > 5 ? history : overview,
    notable_facts: facts.length > 0 ? facts : sentences.slice(0, 3).map(s => s.slice(0, 120)),
    summary,
    category: "General"
  };
};