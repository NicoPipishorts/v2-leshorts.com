// Contour lines (like a topo map). Deterministic, no library.
// data-topo="<seed>": a small terrain for a dark section (1200×800 box).
// data-topo="hero": the page header. Every page has its own terrain (seeded by the page) but the same number of
// rings and points, so transit.js can morph one page's lines into the next page's. The header map is locked to
// the page width (tall viewBox + xMidYMin slice), so a fixed full-screen layer drawn with heroBox() lines up with it.
window.TOPO = (() => {
	const POINTS = 140, PEAKS = 6, RINGS = 8;
	const gen = (seed, hero) => {
		let s = seed % 2147483646 || 1;
		const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
		const peaks = Array.from({ length: hero ? PEAKS : 3 }, () => ({
			x: hero ? -50 + rnd() * 1300 : 150 + rnd() * 900,
			y: hero ? 80 + rnd() * 1100 : 100 + rnd() * 600,
			n: hero ? RINGS : 7 + Math.floor(rnd() * 6), ph: rnd() * 6, sx: hero ? 1 + rnd() * 0.5 : 1.25,
		}));
		const rings = [];
		// Header terrains: each summit gets its own landform (stretch, angle, lobes, lean, ring spacing), so moving
		// between pages reshapes the lines instead of only sliding them around.
		if (hero) for (const p of peaks) {
			const rot = rnd() * Math.PI, c = Math.cos(rot), sn = Math.sin(rot);
			const sx = 0.6 + rnd() * 1.3, sy = 0.5 + rnd() * 0.8, gap = 24 + rnd() * 22;
			const lean = [(rnd() - 0.5) * 16, (rnd() - 0.5) * 16];
			const harm = [2, 3, 4, 5, 7].map((h, j) => ({ h, a: rnd() * [0.24, 0.2, 0.13, 0.09, 0.05][j], ph: rnd() * 6.3 }));
			for (let k = 1; k <= p.n; k++) {
				const pts = new Float32Array((POINTS + 1) * 2), r = k * gap;
				for (let i = 0; i <= POINTS; i++) {
					const t = (i / POINTS) * Math.PI * 2;
					let w = 1;
					for (const q of harm) w += q.a * Math.sin(q.h * t + q.ph + k * 0.18 * q.h);
					const ex = Math.cos(t) * r * w * sx, ey = Math.sin(t) * r * w * sy;
					pts[i * 2] = p.x + lean[0] * k + ex * c - ey * sn;
					pts[i * 2 + 1] = p.y + lean[1] * k + ex * sn + ey * c;
				}
				rings.push({ pts, bold: k % 4 === 0 });
			}
		}
		if (!hero) for (const p of peaks) for (let k = 1; k <= p.n; k++) {
			const pts = new Float32Array((POINTS + 1) * 2), r = k * 34;
			for (let i = 0; i <= POINTS; i++) {
				const t = (i / POINTS) * Math.PI * 2;
				const w = 1 + 0.18 * Math.sin(3 * t + p.ph + k * 0.25) + 0.1 * Math.sin(5 * t - p.ph + k * 0.4) + 0.06 * Math.sin(9 * t + k);
				pts[i * 2] = p.x + Math.cos(t) * r * w * p.sx;
				pts[i * 2 + 1] = p.y + Math.sin(t) * r * w;
			}
			rings.push({ pts, bold: k % 4 === 0 });
		}
		return rings;
	};
	const d = (pts) => { let s = "M"; for (let i = 0; i < pts.length; i += 2) s += (i ? "L" : "") + pts[i].toFixed(1) + "," + pts[i + 1].toFixed(1); return s + "Z"; };
	// Header box: wide screens see the whole 1200-unit map, phones the middle 600 units (lines stay readable).
	const heroBox = () => (document.documentElement.clientWidth >= 900 ? "0 0 1200 4800" : "300 0 600 2400");
	const seedFor = (key) => { let h = 7; for (const c of key) h = (h * 31 + c.charCodeAt(0)) % 2147483646; return h || 7; };
	const svg = (rings, viewBox, cls, align) =>
		`<svg class="${cls}" viewBox="${viewBox}" preserveAspectRatio="${align} slice" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".8">${rings
			.map((r) => `<path d="${d(r.pts)}"${r.bold ? ' stroke-width="1.6"' : ""}/>`).join("")}</g></svg>`;
	return { gen, d, heroBox, seedFor, svg };
})();

document.querySelectorAll("[data-topo]").forEach((el) => {
	const hero = el.dataset.topo === "hero";
	const rings = TOPO.gen(hero ? TOPO.seedFor(window.PAGE_KEY || "index") : Number(el.dataset.topo) || 1, hero);
	el.insertAdjacentHTML("afterbegin", hero ? TOPO.svg(rings, TOPO.heroBox(), "topo hero-topo", "xMidYMin") : TOPO.svg(rings, "0 0 1200 800", "topo", "xMidYMid"));
});
