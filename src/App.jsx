import { useState } from "react";
import ResultCard from "./components/ResultCard";
import CompareView from "./components/CompareView";
import RelatedArticles from "./components/RelatedArticles";
import SearchHistory from "./components/SearchHistory";
import YouTubeVideos from "./components/YouTubeVideos";
import { searchWikipedia, fetchArticle, fetchRelatedArticles } from "./services/wikipedia";
import { analyzeWithClaude } from "./services/claude";
import { fetchYouTubeVideos } from "./services/youtube";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const [isCompare, setIsCompare] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState("");

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCompareResult(null);
    setRelatedArticles([]);
    setVideos([]);
    setHistory(prev => {
      const filtered = prev.filter(h => h !== searchQuery);
      return [searchQuery, ...filtered].slice(0, 10);
    });
    try {
      const isVs = searchQuery.toLowerCase().includes(" vs ");
      if (isVs) {
        setIsCompare(true);
        const parts = searchQuery.toLowerCase().split(" vs ");
        const titleA = await searchWikipedia(parts[0].trim());
        const titleB = await searchWikipedia(parts[1].trim());
        const articleA = await fetchArticle(titleA);
        const articleB = await fetchArticle(titleB);
        const dataA = await analyzeWithClaude(titleA, articleA.extract);
        const dataB = await analyzeWithClaude(titleB, articleB.extract);
        const related = await fetchRelatedArticles(titleA);
        const youtubeVideos = await fetchYouTubeVideos(searchQuery);
        setCompareResult({ dataA, dataB, titleA, titleB });
        setRelatedArticles(related);
        setVideos(youtubeVideos);
      } else {
        setIsCompare(false);
        const title = await searchWikipedia(searchQuery);
        const article = await fetchArticle(title);
        const data = await analyzeWithClaude(title, article.extract);
        const related = await fetchRelatedArticles(title);
        const youtubeVideos = await fetchYouTubeVideos(searchQuery);
        setResult({ data, title, image: article.thumbnail?.source });
        setRelatedArticles(related);
        setVideos(youtubeVideos);
      }
    } catch (err) {
      console.log("ERROR:", err);
      setError("Something went wrong. Please try again!");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "20px 40px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            borderRadius: "12px", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: "20px"
          }}>🔍</div>
          <span style={{
            fontSize: "22px", fontWeight: "800",
            background: "linear-gradient(135deg, #667eea, #f093fb)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>WikiAI Search</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
          Part of Arivu AI
        </span>
      </div>

      <div style={{ textAlign: "center", padding: "60px 20px 20px" }}>
        <h1 style={{
          fontSize: "52px", fontWeight: "900", margin: "0 0 16px",
          background: "linear-gradient(135deg, #fff 0%, #a78bfa 50%, #f093fb 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1.2
        }}>Search. Learn. Discover.</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "18px", margin: "0 0 40px" }}>
          Type anything — AI organizes Wikipedia into beautiful insights
        </p>
        <div style={{
          maxWidth: "680px", margin: "0 auto 16px",
          display: "flex", gap: "12px",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "20px", padding: "8px 8px 8px 20px",
          boxShadow: "0 8px 32px rgba(102,126,234,0.3)"
        }}>
          <input
            type="text"
            placeholder="Search what you want, like Sanjay Shriram..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1, background: "transparent", border: "none",
              outline: "none", color: "white", fontSize: "16px"
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && query.trim()) handleSearch(query.trim());
            }}
          />
          <button
            onClick={() => { if (query.trim()) handleSearch(query.trim()); }}
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              border: "none", borderRadius: "14px",
              padding: "12px 28px", color: "white",
              fontWeight: "700", fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >{loading ? "⏳ Searching..." : "Search →"}</button>
        </div>
        <SearchHistory history={history} onSelect={(item) => { setQuery(item); handleSearch(item); }} />
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{
            display: "inline-block", width: "50px", height: "50px",
            border: "4px solid rgba(255,255,255,0.1)",
            borderTop: "4px solid #667eea",
            borderRadius: "50%", animation: "spin 1s linear infinite"
          }} />
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "16px" }}>Fetching and analyzing...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div style={{
          maxWidth: "600px", margin: "20px auto",
          background: "rgba(255,59,59,0.1)", border: "1px solid rgba(255,59,59,0.3)",
          borderRadius: "16px", padding: "16px 24px",
          color: "#ff6b6b", textAlign: "center"
        }}>⚠️ {error}</div>
      )}

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px 60px" }}>
        {!isCompare && result && (
          <ResultCard data={result.data} title={result.title} image={result.image} />
        )}
        {isCompare && compareResult && (
          <CompareView
            dataA={compareResult.dataA} dataB={compareResult.dataB}
            titleA={compareResult.titleA} titleB={compareResult.titleB}
          />
        )}
        <YouTubeVideos videos={videos} />
        <RelatedArticles articles={relatedArticles} />
      </div>

      <div style={{
        background: "rgba(255,255,255,0.03)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "30px 40px", textAlign: "center"
      }}>
        <p style={{
          background: "linear-gradient(135deg, #667eea, #f093fb)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          fontWeight: "800", fontSize: "18px", margin: "0 0 8px"
        }}>WikiAI Search</p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 6px" }}>
          Built with ❤️ by Sanjay Shriram — Part of Arivu AI
        </p>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", margin: 0 }}>
          © 2026 Arivu AI. Powered by Wikipedia & YouTube API.
        </p>
      </div>
    </div>
  );
}

export default App;