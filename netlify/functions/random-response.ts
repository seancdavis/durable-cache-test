import { Config, Context } from "@netlify/functions";

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const cacheKey = "CACHE_" + url.pathname.replace(/\/+/g, "");
  const randomString = Math.random().toString(36).substring(7);

  const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${randomString}</title>
      </head>
      <body>
        <p>${randomString}</p>
      </body>
    </html>
  `;

  return new Response(htmlResponse, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // The browser should always check freshness
      "Cache-Control": "public, max-age=0, must-revalidate",
      // The CDN should cache for a year, but revalidate if the cache tag changes
      "Netlify-CDN-Cache-Control": "public, durable, s-maxage=31536000",
      // Tag the page with the cache key
      "Netlify-Cache-Tag": cacheKey,
    },
  });
}

export const config: Config = {
  path: "/f/*",
};
