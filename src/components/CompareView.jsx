const CompareView = ({ dataA, dataB, titleA, titleB }) => {
  if (!dataA || !dataB) return null;

  const sections = [
    { icon: "📌", label: "Overview", key: "overview", color: "#a78bfa" },
    { icon: "⭐", label: "Key Points", key: "highlights", color: "#f093fb" },
    { icon: "🔎", label: "More Details", key: "important_details", color: "#43e97b" },
    { icon: "📖", label: "Background", key: "history", color: "#ffd700" },
    { icon: "💡", label: "Did You Know?", key: "notable_facts", color: "#ff6b6b" },
  ];

  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "36px", fontWeight: "900", color: "white", margin: "0 0 8px" }}>
          <span style={{ color: "#667eea" }}>{titleA}</span>
          <span style={{ color: "rgba(255,255,255,0.4)", margin: "0 16px" }}>vs</span>
          <span style={{ color: "#f093fb" }}>{titleB}</span>
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={{ background: "rgba(102,126,234,0.2)", border: "1px solid rgba(102,126,234,0.4)", borderRadius: "16px", padding: "16px", textAlign: "center" }}>
          <span style={{ color: "#667eea", fontWeight: "800", fontSize: "18px" }}>{titleA}</span>
        </div>
        <div style={{ background: "rgba(240,147,251,0.2)", border: "1px solid rgba(240,147,251,0.4)", borderRadius: "16px", padding: "16px", textAlign: "center" }}>
          <span style={{ color: "#f093fb", fontWeight: "800", fontSize: "18px" }}>{titleB}</span>
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          {[dataA, dataB].map((data, idx) => (
            <div key={idx} style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px", padding: "20px"
            }}>
              <h3 style={{ color: section.color, fontWeight: "700", fontSize: "14px", marginBottom: "12px" }}>
                {section.icon} {section.label}
              </h3>
              {Array.isArray(data[section.key]) ? (
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {data[section.key].map((item, i) => (
                    <li key={i} style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", lineHeight: "1.8" }}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", lineHeight: "1.8", margin: 0 }}>{data[section.key]}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CompareView;