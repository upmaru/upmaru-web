type LlmTestRunOgInput = {
  title: string;
  description: string;
  iconDataUris: string[];
};

export default function llmTestRunOgImage({
  title,
  description,
  iconDataUris,
}: LlmTestRunOgInput) {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px",
        background:
          "radial-gradient(circle at 80% 15%, rgba(14,165,233,0.2), transparent 45%), linear-gradient(140deg, #0b1220 0%, #111827 100%)",
        color: "#e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 1.1,
            color: "#38bdf8",
          }}
        >
          UPMARU LLM TESTS
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            lineHeight: 1.05,
            fontWeight: 700,
            color: "#f8fafc",
            maxWidth: "1040px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 31,
            lineHeight: 1.32,
            color: "#cbd5e1",
            maxWidth: "980px",
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {iconDataUris.map((iconDataUri) => (
            <div
              style={{
                display: "flex",
                width: 76,
                height: 76,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(148, 163, 184, 0.35)",
              }}
            >
              <img
                src={iconDataUri}
                alt=""
                width={48}
                height={48}
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
          {iconDataUris.length === 0 && (
            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: "#94a3b8",
              }}
            >
              Model icon preview unavailable
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#94a3b8",
          }}
        >
          upmaru.com
        </div>
      </div>
    </div>
  );
}
