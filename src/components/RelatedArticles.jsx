const RelatedArticles = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  const openArticle = (article) => {
    window.open("https://en.wikipedia.org/wiki/" + encodeURIComponent(article), "_blank");
  };

  return (
    <div style={{
      marginTop: "32px",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "20px",
      padding: "24px"
    }}>
      <h3 style={{
        color: "white", fontWeight: "800",
        fontSize: "20px", marginBottom: "20px",
        display: "flex", alignItems: "center", gap: "10px"
      }}>
        📰 Related Articles
        <span style={{
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          padding: "2px 12px", borderRadius: "20px",
          fontSize: "13px", fontWeight: "600", color: "white"
        }}>
          {articles.length} found
        </span>
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "12px"
      }}>
        {articles.map((article, i) => (
          <div
            key={i}
            onClick={() => openArticle(article)}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(102,126,234,0.1)",
              border: "1px solid rgba(102,126,234,0.2)",
              borderRadius: "12px", padding: "12px 16px",
              color: "rgba(255,255,255,0.8)",
              cursor: "pointer", fontSize: "14px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(102,126,234,0.25)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(102,126,234,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.8)";
            }}
          >
            <span>🔗</span>
            {article}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;