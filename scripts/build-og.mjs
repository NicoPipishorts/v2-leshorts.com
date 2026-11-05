// Builds public/og-image.png (1200×630) in the "Crête" design: the home header's contour lines, the logo, the
// hero pitch. It loads the site's own style.css, brand.js and topo.js, so the card
// follows the site when those change. Rendered by headless Chrome.
// Run: node scripts/build-og.mjs [out.png]
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.resolve(process.argv[2] ?? path.join(ROOT, "public", "og-image.png"));
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const site = (f) => pathToFileURL(path.join(ROOT, "redesign", f)).href;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<link rel="stylesheet" href="${site("style.css")}">
<script src="${site("brand.js")}"></script>
<style>
	body { width: 1200px; height: 630px; overflow: hidden; margin: 0; background: var(--night); }
	.dark { position: absolute; left: 0; top: 0; width: 1200px; height: 630px; }
	.og { position: absolute; inset: 0; padding: 56px 72px 52px; display: grid; grid-template: auto 1fr auto / 1fr; }
	.top { grid-column: 1 / -1; padding: 0; }
	.brand { font-size: 24px; gap: 16px; }
	.brand svg { width: 60px; height: 60px; }
	.url { color: var(--on-night-soft); font-size: 15px; }
	.pitch { align-self: center; }
	.badge { font-size: 13px; }
	h1 { font-size: 60px; margin-top: 26px; max-width: 14ch; }
	.svcs { grid-column: 1 / -1; display: flex; gap: 12px; white-space: nowrap; padding-top: 22px; border-top: 1px solid var(--night-line); color: var(--on-night-soft); font-size: 13px; }
	.svcs b { color: var(--sail); font-weight: 500; }
</style></head><body>
<div class="dark fade">
	<div class="og">
		<div class="top"><span class="brand" data-logo><span>Nicolas Pisar</span></span><span class="mono url">nicolaspisar.com</span></div>
		<div class="pitch">
			<p class="badge mono"><span>Freelance · Isère, Lyon, Grenoble &amp; à distance</span></p>
			<h1>Sites, applications et logiciels <span class="o">sur mesure</span> pour votre activité.</h1>
		</div>
		<p class="svcs mono">Sites internet <b>·</b> Applis iOS &amp; Android <b>·</b> CRM &amp; back-office <b>·</b> Logiciels SaaS <b>·</b> Hébergement &amp; maintenance</p>
	</div>
</div>
<script src="${site("topo.js")}"></script>
<script>
	// the home page's own header terrain, cropped to the card
	const el = document.querySelector(".dark");
	el.insertAdjacentHTML("afterbegin", TOPO.svg(TOPO.gen(TOPO.seedFor("index"), true), "0 0 1200 630", "topo", "xMidYMin"));
</script>
</body></html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "og-"));
const file = path.join(tmp, "og.html");
fs.writeFileSync(file, html);
execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--window-size=1200,630", "--force-device-scale-factor=1", "--virtual-time-budget=8000", `--screenshot=${OUT}`, `file://${file}`], { stdio: "ignore" });
console.log("wrote", path.relative(ROOT, OUT));
