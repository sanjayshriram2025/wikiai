const SearchHistory = ({ history, onSelect }) => {
  if (!history || history.length === 0) return null;

  return (
    <div style={{
      maxWidth: "680px", margin: "0 auto 20px",
      display: "flex", flexWrap: "wrap",
      gap: "8px", justifyContent: "center"
    }}>
      <span style={{
        color: "rgba(255,255,255,0.4)",
        fontSize: "13px", width: "100%",
        textAlign: "center", marginBottom: "4px"
      }}>
        🕐 Recent Searches:
      </span>
      {history.map((item, i) => (
        <button
          key={i}
          onClick={() => onSelect(item)}
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "20px", padding: "6px 16px",
            color: "rgba(255,255,255,0.7)",
            fontSize: "13px", cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(102,126,234,0.3)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.07)";
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
          }}
        >
          🔍 {item}
        </button>
      ))}
    </div>
  );
};

export default SearchHistory;