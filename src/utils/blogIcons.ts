import type { CollectionEntry } from "astro:content";
import {
  AiNetworkIcon,
  ChartRadarIcon,
  Flowchart02Icon,
} from "@hugeicons/core-free-icons";

const FALLBACK_POST_ICON = "AiNetworkIcon";

const BLOG_POST_ICONS = {
  AiNetworkIcon,
  ChartRadarIcon,
  Flowchart02Icon,
} as const;

type BlogIconName = keyof typeof BLOG_POST_ICONS;

export type BlogIconNode = typeof AiNetworkIcon;

function isSupportedBlogIcon(iconName: string): iconName is BlogIconName {
  return Object.hasOwn(BLOG_POST_ICONS, iconName);
}

export function resolveBlogPostIcon(
  post: CollectionEntry<"blog">,
): BlogIconNode {
  const requestedIcon = post.data.icon;
  if (requestedIcon && isSupportedBlogIcon(requestedIcon)) {
    return BLOG_POST_ICONS[requestedIcon];
  }

  return BLOG_POST_ICONS[FALLBACK_POST_ICON];
}
