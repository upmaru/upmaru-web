import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "../../utils/generateOgImages";

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  const publishedPosts = posts.filter(
    ({ data }) => !data.draft && !data.ogImage,
  );

  return publishedPosts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: CollectionEntry<"blog"> };

  return new Response(await generateOgImageForPost(post), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
