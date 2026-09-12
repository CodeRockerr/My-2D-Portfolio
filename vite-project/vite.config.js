import { defineConfig, loadEnv } from "vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { renderPage, escapeHtml } from "./src/render.js";
import { pages, profile } from "./src/content.js";

const root = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, "VITE_");
  const origin = new URL(env.VITE_SITE_URL || profile.siteUrl).origin;
  return {
    base: "/",
    plugins: [
      {
        name: "portfolio-static-pages",
        transformIndexHtml: {
          order: "pre",
          handler(html) {
            const page = html.match(/data-page="([a-z0-9-]+)"/)?.[1];
            if (!page || !pages[page])
              throw new Error("Missing or unknown page identifier");
            const meta = pages[page];
            const values = {
              title: meta.title,
              description: meta.description,
              canonical: origin + meta.path,
              origin,
            };
            return html
              .replace(
                /\{\{(title|description|canonical|origin)\}\}/g,
                (_, key) => escapeHtml(values[key]),
              )
              .replace("<!--app-->", renderPage(page));
          },
        },
        generateBundle() {
          const urls = Object.entries(pages)
            .filter(([key]) => key !== "404")
            .map(
              ([, page]) =>
                `<url><loc>${escapeHtml(origin + page.path)}</loc></url>`,
            )
            .join("");
          this.emitFile({
            type: "asset",
            fileName: "sitemap.xml",
            source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
          });
          this.emitFile({
            type: "asset",
            fileName: "robots.txt",
            source: `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
          });
        },
      },
    ],
    build: {
      rolldownOptions: {
        input: Object.fromEntries(
          Object.keys(pages).map((page) => [
            page,
            resolve(
              root,
              page === "home"
                ? "index.html"
                : page === "404"
                  ? "404.html"
                  : `${page}/index.html`,
            ),
          ]),
        ),
      },
    },
    server: { host: "127.0.0.1", port: 5173, strictPort: true },
    preview: { host: "127.0.0.1", port: 4173, strictPort: true },
  };
});
