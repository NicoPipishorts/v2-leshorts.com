// Local server for the site, routed like vercel.json: clean URLs (/portfolio serves portfolio.html),
// /portfolio/<slug> is rendered by scripts/prerender.mjs as at build, files come from redesign/ then public/, and POST /api/contact runs the
// same handler as api/contact.js (env from .env.local). Run: npm run dev
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { sendContact } from "../server/sendContact.mjs";
import { renderProject } from "./prerender.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIRS = ["redesign", "public"].map((d) => path.join(ROOT, d));
const PORT = Number(process.env.PORT) || 6686;
// Cloudflare's always-pass test secret unless a real one is in .env.local
const env = { TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA", ...loadEnv("development", ROOT, "") };
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".pdf": "application/pdf", ".xml": "application/xml", ".txt": "text/plain" };

const find = (p) => {
	for (const dir of DIRS) {
		const f = path.join(dir, p);
		if (f.startsWith(dir) && fs.statSync(f, { throwIfNoEntry: false })?.isFile()) return f;
	}
};

http.createServer(async (req, res) => {
	const url = new URL(req.url, "http://x");
	if (url.pathname === "/api/contact") {
		res.setHeader("Content-Type", "application/json");
		if (req.method !== "POST") return res.writeHead(405).end(JSON.stringify({ ok: false, error: "method_not_allowed" }));
		let raw = "";
		for await (const chunk of req) raw += chunk;
		try {
			const { status, body } = await sendContact(JSON.parse(raw || "{}"), env, req.socket.remoteAddress);
			return res.writeHead(status).end(JSON.stringify(body));
		} catch (error) {
			console.error("Contact form failed in dev server:", error);
			return res.writeHead(500).end(JSON.stringify({ ok: false, error: "server_error" }));
		}
	}
	const p = decodeURIComponent(url.pathname);
	if (p.endsWith(".html")) return res.writeHead(308, { Location: (p === "/index.html" ? "/" : p.slice(0, -5)) + url.search }).end();
	const slug = p.match(/^\/portfolio\/([\w-]+)\/?$/)?.[1];
	if (slug) {
		const html = renderProject(slug);
		return html ? res.writeHead(200, { "Content-Type": TYPES[".html"], "Cache-Control": "no-store" }).end(html) : res.writeHead(404).end("Not found");
	}
	const file = find(p === "/" ? "index.html" : p) ?? find(`${p}.html`);
	if (!file) return res.writeHead(404).end("Not found");
	res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store" });
	fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`[dev] http://localhost:${PORT}`));
