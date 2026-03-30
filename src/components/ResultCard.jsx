const cards = [
  { bg: "rgba(102,126,234,0.15)", border: "rgba(102,126,234,0.4)", icon: "📌", label: "Overview", key: "overview", text: "#a78bfa" },
  { bg: "rgba(240,147,251,0.15)", border: "rgba(240,147,251,0.4)", icon: "⭐", label: "Key Points", key: "highlights", text: "#f093fb" },
  { bg: "rgba(67,233,123,0.15)", border: "rgba(67,233,123,0.4)", icon: "🔎", label: "More Details", key: "important_details", text: "#43e97b" },
  { bg: "rgba(255,184,0,0.15)", border: "rgba(255,184,0,0.4)", icon: "📖", label: "Background", key: "history", text: "#ffd700" },
  { bg: "rgba(255,107,107,0.15)", border: "rgba(255,107,107,0.4)", icon: "💡", label: "Did You Know?", key: "notable_facts", text: "#ff6b6b" },
];

const ResultCard = ({ data, title, image }) => {
  if (!data) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        {image && (
          <div style={{
            display: "inline-block", marginBottom: "20px",
            borderRadius: "20px",
            border: "3px solid rgba(102,126,234,0.5)",
            boxShadow: "0 8px 32px rgba(102,126,234,0.3)",
            overflow: "hidden", maxWidth: "300px"
          }}>
            <img src={image} alt={title} style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        )}
        <h2 style={{ fontSize: "36px", fontWeight: "900", color: "white", margin: "0 0 8px" }}>{title}</h2>
        <span style={{
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          padding: "4px 16px", borderRadius: "20px",
          color: "white", fontSize: "13px", fontWeight: "600"
        }}>{data.category}</span>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "20px", padding: "24px", marginBottom: "24px"
      }}>
        <h3 style={{ color: "white", fontWeight: "700", fontSize: "16px", marginBottom: "12px" }}>📝 Summary</h3>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", lineHeight: "1.9", margin: 0 }}>{data.summary}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {cards.map((card) => (
          <div key={card.key} style={{
            background: card.bg, border: "1px solid " + card.border,
            borderRadius: "20px", padding: "24px", transition: "transform 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <h3 style={{ color: card.text, fontWeight: "700", fontSize: "15px", marginBottom: "14px" }}>
              {card.icon} {card.label}
            </h3>
            {Array.isArray(data[card.key]) ? (
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {data[card.key].length > 0 ? data[card.key].map((item, i) => (
                  <li key={i} style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: "1.8" }}>{item}</li>
                )) : (
                  <li style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>No data available</li>
                )}
              </ul>
            ) : (
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: "1.8", margin: 0 }}>
                {data[card.key] || "No data available"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultCard;