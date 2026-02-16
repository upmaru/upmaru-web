import type { CollectionEntry } from "astro:content";
import { createElement } from "react";

type IconNode = [string, Record<string, string | number>];

export default function postOgImage(
  post: CollectionEntry<"blog">,
  icon: IconNode[],
) {
  const publishedAt = post.data.pubDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px",
        background: "linear-gradient(135deg, #0f172a 0%, #111827 100%)",
        color: "#e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: "-90px",
          top: "-120px",
          width: 620,
          height: 620,
          opacity: 0.14,
          color: "#38bdf8",
          transform: "rotate(-8deg)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
        >
          {icon.map(([tag, attrs], index) =>
            createElement(tag, { ...attrs, key: index }),
          )}
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 26,
          fontWeight: 700,
          color: "#38bdf8",
          letterSpacing: 1.2,
        }}
      >
        <div style={{ display: "flex" }}>UPMARU BLOG</div>
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
            fontSize: 62,
            lineHeight: 1.1,
            fontWeight: 700,
            color: "#f8fafc",
          }}
        >
          {post.data.title}
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.4,
            color: "#94a3b8",
          }}
        >
          {post.data.description}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 24,
          color: "#cbd5e1",
        }}
      >
        <div style={{ display: "flex" }}>By {post.data.author}</div>
        <div style={{ display: "flex" }}>{publishedAt}</div>
      </div>
    </div>
  );
}
