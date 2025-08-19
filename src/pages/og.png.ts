import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@/utils/generateOgImages";

export const GET: APIRoute = async () =>
  // @ts-ignore
  new Response(await generateOgImageForSite(), {
    headers: { "Content-Type": "image/png" },
  });
