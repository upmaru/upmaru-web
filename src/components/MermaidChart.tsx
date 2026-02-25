import { useEffect, useRef } from "react";
import mermaid from "mermaid";

type MermaidChartProps = {
  chart: string;
  className?: string;
};

let initialized = false;

export default function MermaidChart({ chart, className }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialized) {
      const resolveThemeColor = (cssVar: string, fallback: string) => {
        const probe = document.createElement("div");
        probe.style.position = "absolute";
        probe.style.opacity = "0";
        probe.style.pointerEvents = "none";
        probe.style.backgroundColor = `var(${cssVar})`;
        document.body.appendChild(probe);
        const resolved = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return resolved && resolved !== "rgba(0, 0, 0, 0)"
          ? resolved
          : fallback;
      };

      const sectionBase100 = resolveThemeColor(
        "--color-base-100",
        "rgb(17, 24, 39)",
      );
      const sectionBase300 = resolveThemeColor(
        "--color-base-300",
        "rgb(55, 65, 81)",
      );
      const successColor = resolveThemeColor(
        "--color-success",
        "rgb(34, 197, 94)",
      );
      const warningColor = resolveThemeColor(
        "--color-warning",
        "rgb(245, 158, 11)",
      );
      const errorColor = resolveThemeColor("--color-error", "rgb(239, 68, 68)");

      const shade = (rgb: string, factor: number) => {
        const match = rgb.match(
          /rgba?\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)/i,
        );
        if (!match) return rgb;
        const [, r, g, b] = match;
        const rr = Math.round(Number(r) * factor);
        const gg = Math.round(Number(g) * factor);
        const bb = Math.round(Number(b) * factor);
        return `rgb(${rr}, ${gg}, ${bb})`;
      };

      const relativeLuminance = (rgb: string) => {
        const match = rgb.match(
          /rgba?\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)/i,
        );
        if (!match) return 0;
        const [, r, g, b] = match;
        return (
          (0.2126 * Number(r) + 0.7152 * Number(g) + 0.0722 * Number(b)) / 255
        );
      };

      const darkenForContrast = (rgb: string, targetLuminance = 0.22) => {
        const luminance = relativeLuminance(rgb);
        const factor =
          luminance > targetLuminance ? targetLuminance / luminance : 0.92;
        return shade(rgb, Math.max(0.08, Math.min(1, factor)));
      };

      const sectionBase100Dark = darkenForContrast(sectionBase100);
      const sectionBase300Dark = darkenForContrast(sectionBase300);

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          gantt: {
            numberSectionStyles: 2,
          },
          themeVariables: {
            background: "#0b1220",
            primaryColor: "#0f172a",
            primaryBorderColor: "#38bdf8",
            primaryTextColor: "#e2e8f0",
            lineColor: "#38bdf8",
            fontFamily: "SN Pro, system-ui, sans-serif",
            sectionBkgColor: sectionBase100Dark,
            sectionBkgColor2: sectionBase100Dark,
            altSectionBkgColor: sectionBase300Dark,
            sectionLabelColor: "#f1f5f9",
            taskBkgColor: "#0f172a",
            taskBorderColor: "#38bdf8",
            taskTextColor: "#f8fafc",
            taskTextLightColor: "#f8fafc",
            taskTextDarkColor: "#f8fafc",
            taskTextOutsideColor: "#e2e8f0",
            activeTaskBkgColor: shade(warningColor, 0.38),
            activeTaskBorderColor: warningColor,
            doneTaskBkgColor: shade(successColor, 0.38),
            doneTaskBorderColor: successColor,
            critBkgColor: shade(errorColor, 0.38),
            critBorderColor: errorColor,
            gridColor: "#38bdf8",
            todayLineColor: "#14b8a6",
          },
        });
      } catch {
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
        });
      }
      initialized = true;
    }

    let cancelled = false;
    const render = async () => {
      try {
        const id = `mermaid-gantt-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled && containerRef.current) {
          containerRef.current.textContent = chart;
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  return <div ref={containerRef} className={className} />;
}
