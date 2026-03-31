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
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCompareResult(null);
    setRelatedArticles([]);
    setVideos([]);
    setSearched(true);
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
      background: "#050510",
      fontFamily: "'Segoe UI', sans-serif",
      color: "white",
      overflowX: "hidden"
    }}>

      {/* Background */}
      <div style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 50%, rgba(102,126,234,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(240,147,251,0.08) 0%, transparent 60%)"
      }} />

      {/* Header */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        background: "rgba(5,5,16,0.8)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "42px", height: "42px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            borderRadius: "13px", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: "20px", boxShadow: "0 4px 20px rgba(102,126,234,0.35)"
          }}>🔍</div>
          <div>
            <div style={{
              fontSize: "20px", fontWeight: "800",
              background: "linear-gradient(135deg, #667eea, #f093fb)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>WikiAI Search</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "1px" }}>
              Part of Arivu AI
            </div>
          </div>
        </div>
        <a href="https://arivu-two.vercel.app" style={{
          background: "rgba(102,126,234,0.12)",
          border: "1px solid rgba(102,126,234,0.25)",
          borderRadius: "20px", padding: "6px 16px",
          color: "#a78bfa", fontSize: "12px",
          fontWeight: "600", textDecoration: "none"
        }}>← Back to Arivu AI</a>
      </div>

      {/* Hero */}
      <div style={{
        position: "relative", zIndex: 10,
        textAlign: "center",
        padding: searched ? "40px 20px 30px" : "80px 20px 60px",
        transition: "padding 0.5s"
      }}>
        {!searched && (
          <>
            <div style={{
              display: "inline-block",
              background: "rgba(102,126,234,0.1)",
              border: "1px solid rgba(102,126,234,0.25)",
              borderRadius: "20px", padding: "6px 18px",
              color: "#a78bfa", fontSize: "12px",
              fontWeight: "600", marginBottom: "24px"
            }}>
              🌐 Powered by Wikipedia + AI
            </div>
            <h1 style={{
              fontSize: "54px", fontWeight: "800",
              lineHeight: 1.1, margin: "0 0 16px"
            }}>
              Search.<br/>
              <span style={{
                background: "linear-gradient(135deg, #667eea, #f093fb)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Learn. Discover.</span>
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.4)", fontSize: "17px",
              maxWidth: "500px", margin: "0 auto 40px", lineHeight: 1.7
            }}>
              Type anything — AI organizes Wikipedia into beautiful insights, videos and articles
            </p>
          </>
        )}

        {/* Search Bar */}
        <div style={{
          maxWidth: "680px", margin: "0 auto 16px",
          display: "flex", gap: "10px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "18px", padding: "8px 8px 8px 20px",
          boxShadow: "0 8px 40px rgba(102,126,234,0.2)"
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
              background: loading ? "rgba(102,126,234,0.5)" : "linear-gradient(135deg, #667eea, #764ba2)",
              border: "none", borderRadius: "12px",
              padding: "12px 28px", color: "white",
              fontWeight: "700", fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(102,126,234,0.3)",
              transition: "all 0.2s"
            }}
          >{loading ? "⏳" : "Search →"}</button>
        </div>

        <SearchHistory history={history} onSelect={(item) => { setQuery(item); handleSearch(item); }} />
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "60px" }}>
          <div style={{
            display: "inline-block", width: "48px", height: "48px",
            border: "3px solid rgba(102,126,234,0.2)",
            borderTop: "3px solid #667eea",
            borderRadius: "50%", animation: "spin 0.8s linear infinite"
          }} />
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "16px", fontSize: "15px" }}>
            Searching Wikipedia and analyzing...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: "600px", margin: "20px auto",
          background: "rgba(255,59,59,0.08)",
          border: "1px solid rgba(255,59,59,0.25)",
          borderRadius: "16px", padding: "16px 24px",
          color: "#ff6b6b", textAlign: "center"
        }}>⚠️ {error}</div>
      )}

      {/* Results */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 20px 80px" }}>
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

      {/* Footer */}
      <div style={{
        position: "relative", zIndex: 10,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 40px", textAlign: "center"
      }}>
        <div style={{
          fontSize: "18px", fontWeight: "800",
          background: "linear-gradient(135deg, #667eea, #f093fb)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "8px"
        }}>WikiAI Search</div>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", marginBottom: "4px" }}>
          Built with ❤️ by Sanjay Shriram — Part of Arivu AI
        </p>
        <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px" }}>
          © 2026 Arivu AI. Powered by Wikipedia & YouTube API.
        </p>
      </div>
    </div>
  );
}

export default App;