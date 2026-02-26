import type { APIRoute } from "astro";
import { generateOgImageForSite } from "../utils/generateOgImages";

export const prerender = true;

export const GET: APIRoute = async () => {
  return new Response(await generateOgImageForSite(), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
