// Builds the site that Vercel serves: the static "Crête" pages in redesign/ plus the files in public/
// (CVs, favicon, OG image, robots, sitemap), copied into dist/. No bundler: the pages are plain HTML/CSS/JS.
// At build time it fills in the Turnstile site key (VITE_TURNSTILE_SITE_KEY, as for the former React site)
// and adds Vercel Web Analytics. Run: node scripts/build-site.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "dist");

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, "public"), OUT, { recursive: true });
fs.cpSync(path.join(ROOT, "redesign"), OUT, { recursive: true });

const siteKey = process.env.VITE_TURNSTILE_SITE_KEY || process.env.TURNSTILE_SITE_KEY || "";
if (!siteKey) console.warn("[build-site] no VITE_TURNSTILE_SITE_KEY: the contact form falls back to Cloudflare's test key");
const analytics = '<script defer src="/_vercel/insights/script.js"></script>';

for (const file of fs.readdirSync(OUT).filter((f) => f.endsWith(".html"))) {
	const p = path.join(OUT, file);
	let html = fs.readFileSync(p, "utf8");
	if (siteKey) html = html.replaceAll("__TURNSTILE_SITE_KEY__", siteKey);
	html = html.replace("</head>", `${analytics}\n</head>`);
	fs.writeFileSync(p, html);
}
console.log("[build-site] wrote", path.relative(ROOT, OUT));
