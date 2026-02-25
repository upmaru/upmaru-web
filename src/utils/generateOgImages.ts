import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import type { CollectionEntry } from "astro:content";
import satori, { type SatoriOptions } from "satori";
import llmTestOgImage from "./og-templates/llm-test";
import llmTestRunOgImage from "./og-templates/llm-test-run";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";

const require = createRequire(import.meta.url);
const FALLBACK_POST_ICON = "AiNetworkIcon";
const ICON_NAME_PATTERN = /^[A-Za-z0-9]+Icon$/;
type IconNode = [string, Record<string, string | number>];

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

async function loadSnProFonts() {
  const regularPath =
    require.resolve("@fontsource/sn-pro/files/sn-pro-latin-400-normal.woff");
  const boldPath =
    require.resolve("@fontsource/sn-pro/files/sn-pro-latin-700-normal.woff");

  const [fontRegular, fontBold] = await Promise.all([
    readFile(regularPath).then(toArrayBuffer),
    readFile(boldPath).then(toArrayBuffer),
  ]);

  return { fontRegular, fontBold };
}

const { fontRegular, fontBold } = await loadSnProFonts();

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "SN Pro",
      data: fontRegular,
      weight: 400,
      style: "normal",
    },
    {
      name: "SN Pro",
      data: fontBold,
      weight: 700,
      style: "normal",
    },
  ],
};

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

function resolveMimeType(filePath: string) {
  const extension = extname(filePath).toLowerCase();
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function loadPublicAssetAsDataUri(publicPath: string | null) {
  if (!publicPath) return null;

  const normalizedPath = publicPath.startsWith("/")
    ? publicPath.slice(1)
    : publicPath;

  try {
    const absolutePath = join(process.cwd(), "public", normalizedPath);
    const binary = await readFile(absolutePath);
    const mimeType = resolveMimeType(normalizedPath);
    return `data:${mimeType};base64,${binary.toString("base64")}`;
  } catch {
    return null;
  }
}

async function resolvePostOgIcon(iconName?: string): Promise<IconNode[]> {
  const safeIconName =
    iconName && ICON_NAME_PATTERN.test(iconName)
      ? iconName
      : FALLBACK_POST_ICON;

  try {
    const iconModule = await import(
      /* @vite-ignore */ `@hugeicons/core-free-icons/${safeIconName}`
    );
    return iconModule.default as IconNode[];
  } catch {
    const fallbackModule =
      await import("@hugeicons/core-free-icons/AiNetworkIcon");
    return fallbackModule.default as IconNode[];
  }
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  const icon = await resolvePostOgIcon(post.data.icon);
  const svg = await satori(postOgImage(post, icon), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}

type LlmTestOgImageInput = {
  runLabel: string;
  title: string;
  description: string;
  iconPath: string | null;
};

export async function generateOgImageForLlmTest({
  runLabel,
  title,
  description,
  iconPath,
}: LlmTestOgImageInput) {
  const iconDataUri = await loadPublicAssetAsDataUri(iconPath);
  const svg = await satori(
    llmTestOgImage({
      runLabel,
      title,
      description,
      iconDataUri,
    }),
    options,
  );
  return svgBufferToPngBuffer(svg);
}

type LlmTestRunOgImageInput = {
  title: string;
  description: string;
  iconPaths: string[];
};

export async function generateOgImageForLlmTestRun({
  title,
  description,
  iconPaths,
}: LlmTestRunOgImageInput) {
  const iconDataUris = (
    await Promise.all(
      iconPaths.map((iconPath) => loadPublicAssetAsDataUri(iconPath)),
    )
  ).filter((iconDataUri): iconDataUri is string => Boolean(iconDataUri));

  const svg = await satori(
    llmTestRunOgImage({
      title,
      description,
      iconDataUris,
    }),
    options,
  );
  return svgBufferToPngBuffer(svg);
}
