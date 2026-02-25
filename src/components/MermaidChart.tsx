import { useEffect, useRef } from "react";
import mermaid from "mermaid";

type MermaidChartProps = {
  chart: string;
  className?: string;
};

export default function MermaidChart({ chart, className }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resolveThemeColor = (cssVar: string, fallback: string) => {
      const probe = document.createElement("div");
      probe.style.position = "absolute";
      probe.style.opacity = "0";
      probe.style.pointerEvents = "none";
      probe.style.backgroundColor = `var(${cssVar})`;
      document.body.appendChild(probe);
      const resolved = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return resolved && resolved !== "rgba(0, 0, 0, 0)" ? resolved : fallback;
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

    const toRgbChannels = (color: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#000";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return { r, g, b };
    };

    const shade = (color: string, factor: number) => {
      const rgb = toRgbChannels(color);
      if (!rgb) return color;
      const clamp = (value: number) => Math.max(0, Math.min(255, value));
      const rr = clamp(Math.round(rgb.r * factor));
      const gg = clamp(Math.round(rgb.g * factor));
      const bb = clamp(Math.round(rgb.b * factor));
      return `rgb(${rr}, ${gg}, ${bb})`;
    };

    const relativeLuminance = (color: string) => {
      const rgb = toRgbChannels(color);
      if (!rgb) return 0;
      return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
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
          activeTaskBkgColor: shade(warningColor, 0.7),
          activeTaskBorderColor: warningColor,
          doneTaskBkgColor: shade(successColor, 0.7),
          doneTaskBorderColor: successColor,
          critBkgColor: shade(errorColor, 0.7),
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
