// Builds public/og-image.png (1200×630): the dotted hexagon logo, two-thirds in frame, beside the
// name and a one-line description. Rendered by headless Chrome.
// Run: node scripts/build-og.mjs [out.png]
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.resolve(process.argv[2] ?? path.join(ROOT, "public", "og-image.png"));
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const logoSrc = fs.readFileSync(path.join(ROOT, "src/components/Logo.tsx"), "utf8");
const [HEX, MARK] = [...logoSrc.matchAll(/export const LOGO_\w+_PATH =\s*"([^"]+)"/g)].map((m) => m[1]);

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@800&family=Manrope:wght@500;600&family=JetBrains+Mono:wght@400&display=block" rel="stylesheet">
<style>
	* { margin: 0; padding: 0; box-sizing: border-box; }
	body { width: 1200px; height: 630px; overflow: hidden; background: #0b0c0f; color: #f1ece4; font-family: Manrope, sans-serif; position: relative; }
	.glow { position: absolute; border-radius: 50%; filter: blur(90px); }
	canvas { position: absolute; inset: 0; width: 1200px; height: 630px; }
	.copy { position: absolute; left: 72px; top: 0; bottom: 0; width: 700px; display: flex; flex-direction: column; justify-content: center; }
	.pill { display: inline-flex; align-items: center; gap: 10px; font: 400 15px/1 "JetBrains Mono", monospace; letter-spacing: .14em; text-transform: uppercase; color: #f1ece4b3; }
	.pill i { width: 9px; height: 9px; border-radius: 50%; background: #5fd38d; box-shadow: 0 0 12px #5fd38d; }
	h1 { margin-top: 26px; font: 800 104px/.86 Unbounded, sans-serif; letter-spacing: -.035em; text-transform: uppercase; }
	h1 span { color: #b79a77; display: block; }
	.role { margin-top: 26px; font: 600 30px/1.2 Manrope, sans-serif; color: #dc5c48; }
	.desc { margin-top: 14px; font: 500 22px/1.4 Manrope, sans-serif; color: #f1ece4b8; max-width: 620px; }
	.url { position: absolute; left: 72px; bottom: 44px; font: 400 17px/1 "JetBrains Mono", monospace; letter-spacing: .16em; text-transform: uppercase; color: #f1ece499; }
</style></head><body>
	<div class="glow" style="left:-160px;top:220px;width:520px;height:520px;background:#dc5c4830"></div>
	<div class="glow" style="right:-120px;top:-160px;width:560px;height:560px;background:#488b9b2e"></div>
	<canvas id="c" width="2400" height="1260"></canvas>
	<div class="copy">
		<p class="pill"><i></i>Open to Lead Frontend / Full-stack roles</p>
		<h1>Nicolas<span>Pisar</span></h1>
		<p class="role">Lead Frontend &amp; Full-stack Engineer</p>
		<p class="desc">Portfolio &amp; case studies — React, TypeScript and AI-augmented product engineering. Synqit, Kaast and 9 more products shipped end to end.</p>
	</div>
	<p class="url">nicolaspisar.com</p>
<script>
	// same dot sampling as the site's ParticleLogo, frozen in place
	const c = document.getElementById("c"), ctx = c.getContext("2d");
	ctx.scale(2, 2);
	const size = 640, cx = 1200 - size / 3 + 12, cy = 315; // about two-thirds of the logo in frame
	const off = document.createElement("canvas"); off.width = off.height = size;
	const o = off.getContext("2d"); o.scale(size / 218, size / 218);
	o.fillStyle = "#f00"; o.fill(new Path2D(${JSON.stringify(MARK)}));
	o.strokeStyle = "#00f"; o.lineWidth = 7; o.stroke(new Path2D(${JSON.stringify(HEX)}));
	const d = o.getImageData(0, 0, size, size).data, gap = 7, colors = ["#dc5c48", "#e8836f", "#b79a77"];
	let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; // deterministic output
	for (let y = 0; y < size; y += gap) for (let x = 0; x < size; x += gap) {
		const i = (y * size + x) * 4; if (d[i + 3] < 128) continue;
		const hex = d[i + 2] > d[i];
		const s = hex ? 2.6 : 2.4 + rnd() * 2;
		ctx.fillStyle = hex ? "#488b9b" : colors[(rnd() * 3) | 0];
		ctx.fillRect(cx - size / 2 + x, cy - size / 2 + y, s, s);
	}
</script></body></html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "og-"));
const file = path.join(tmp, "og.html");
fs.writeFileSync(file, html);
execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1200,630", "--force-device-scale-factor=1", "--virtual-time-budget=8000", `--screenshot=${OUT}`, `file://${file}`], { stdio: "ignore" });
console.log("wrote", path.relative(ROOT, OUT));
