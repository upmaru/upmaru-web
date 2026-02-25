type LlmTestOgInput = {
  runLabel: string;
  title: string;
  description: string;
  iconDataUri: string | null;
};

export default function llmTestOgImage({
  runLabel,
  title,
  description,
  iconDataUri,
}: LlmTestOgInput) {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px",
        background: "linear-gradient(140deg, #0b1220 0%, #111827 100%)",
        color: "#e2e8f0",
      }}
    >
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
            flexDirection: "column",
            gap: "8px",
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
              fontSize: 22,
              color: "#94a3b8",
            }}
          >
            {runLabel}
          </div>
        </div>
        {iconDataUri ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 164,
              height: 164,
              borderRadius: 28,
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(148, 163, 184, 0.35)",
            }}
          >
            <img
              src={iconDataUri}
              alt=""
              width={116}
              height={116}
              style={{ objectFit: "contain" }}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              width: 164,
              height: 164,
              borderRadius: 28,
              border: "1px solid rgba(148, 163, 184, 0.35)",
              background: "rgba(15, 23, 42, 0.7)",
            }}
          />
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 68,
            lineHeight: 1.06,
            fontWeight: 700,
            color: "#f8fafc",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            lineHeight: 1.35,
            color: "#cbd5e1",
          }}
        >
          {description}
        </div>
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
  );
}
