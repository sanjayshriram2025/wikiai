const YouTubeVideos = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

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
        🎥 Related Videos
        <span style={{
          background: "linear-gradient(135deg, #ff0000, #ff6b6b)",
          padding: "2px 12px", borderRadius: "20px",
          fontSize: "13px", fontWeight: "600", color: "white"
        }}>
          {videos.length} videos
        </span>
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "16px"
      }}>
        {videos.map((video, i) => (
          <div
            key={i}
            onClick={() => window.open("https://www.youtube.com/watch?v=" + video.id.videoId, "_blank")}
            style={{
              background: "rgba(255,0,0,0.08)",
              border: "1px solid rgba(255,0,0,0.2)",
              borderRadius: "16px", overflow: "hidden",
              cursor: "pointer", transition: "transform 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ position: "relative" }}>
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                style={{ width: "100%", display: "block" }}
              />
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(255,0,0,0.85)",
                borderRadius: "50%", width: "50px", height: "50px",
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "20px"
              }}>▶️</div>
            </div>
            <div style={{ padding: "12px" }}>
              <p style={{
                color: "white", fontWeight: "600", fontSize: "13px",
                margin: "0 0 6px", lineHeight: "1.4",
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden"
              }}>{video.snippet.title}</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>
                {video.snippet.channelTitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeVideos;