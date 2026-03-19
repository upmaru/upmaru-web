import type { CollectionEntry } from "astro:content";

const FALLBACK_POST_ICON = "AiNetworkIcon";
const ICON_NAME_PATTERN = /^[A-Za-z0-9]+Icon$/;

export type BlogIconNode = [string, Record<string, string | number>];

export async function resolveBlogPostIcon(
  post: CollectionEntry<"blog">,
): Promise<BlogIconNode[]> {
  const requestedIcon = post.data.icon;
  const safeIconName =
    requestedIcon && ICON_NAME_PATTERN.test(requestedIcon)
      ? requestedIcon
      : FALLBACK_POST_ICON;

  try {
    const iconModule = await import(
      /* @vite-ignore */ `@hugeicons/core-free-icons/${safeIconName}`
    );
    return iconModule.default as BlogIconNode[];
  } catch {
    const fallbackModule = await import(
      /* @vite-ignore */ `@hugeicons/core-free-icons/${FALLBACK_POST_ICON}`
    );
    return fallbackModule.default as BlogIconNode[];
  }
}
