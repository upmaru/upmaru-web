export default function siteOgImage() {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px",
        background: "linear-gradient(140deg, #0b1220 0%, #111827 100%)",
        color: "#e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 28,
          letterSpacing: 1.3,
          fontWeight: 700,
          color: "#38bdf8",
        }}
      >
        UPMARU
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div
          style={{
            display: "flex",
            fontSize: 74,
            lineHeight: 1.05,
            fontWeight: 700,
            color: "#f8fafc",
          }}
        >
          AI-native stack for builders.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            lineHeight: 1.35,
            color: "#94a3b8",
          }}
        >
          Infrastructure, intelligence, and product layers that launch software
          faster.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: "#cbd5e1",
        }}
      >
        upmaru.com
      </div>
    </div>
  );
}
