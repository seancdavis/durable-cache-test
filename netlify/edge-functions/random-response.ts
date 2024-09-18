import type { Config, Context } from "@netlify/edge-functions";
import { html } from "https://deno.land/x/html/mod.ts";

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const { pathname } = url;
  const randomString = Math.random().toString(36).substring(7);

  const htmlResponse = html`
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
      "content-type": "text/html; charset=utf-8",
      // The browser should always check freshness
      "cache-control": "public, max-age=0, must-revalidate",
      // The CDN should cache for a year, but revalidate if the cache tag changes
      "netlify-cdn-cache-control": "public, durable, s-maxage=31536000",
      // Tag the page with the user ID
      "netlify-cache-tag": pathname,
    },
  });
}

export const config: Config = {
  path: "/*",
  excludedPath: ["/"],
};
