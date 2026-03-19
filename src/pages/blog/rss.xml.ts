import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async ({ site }) => {
  const canonicalSite = site ?? new URL("https://upmaru.com");
  const posts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const lastBuildDate =
    posts.reduce((latest, post) => {
      const candidate = post.data.updatedDate ?? post.data.pubDate;
      return candidate.getTime() > latest.getTime() ? candidate : latest;
    }, new Date(0)) || new Date();

  const items = posts
    .map((post) => {
      const link = new URL(`/blog/${post.slug}`, canonicalSite).toString();
      const pubDate = post.data.pubDate.toUTCString();
      const description = `${post.data.description} By ${post.data.author}.`;

      return [
        "<item>",
        `<title>${escapeXml(post.data.title)}</title>`,
        `<link>${escapeXml(link)}</link>`,
        `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `<pubDate>${pubDate}</pubDate>`,
        `<description>${escapeXml(description)}</description>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    "<title>Upmaru Blog Feed</title>",
    "<description>Articles and product updates from Upmaru.</description>",
    `<link>${escapeXml(new URL("/blog", canonicalSite).toString())}</link>`,
    "<language>en-us</language>",
    `<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`,
    `<atom:link href="${escapeXml(new URL("/blog/rss.xml", canonicalSite).toString())}" rel="self" type="application/rss+xml" />`,
    items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=900",
    },
  });
};
