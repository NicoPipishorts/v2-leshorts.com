// Page transitions, kept simple: only the blue header block and its contour lines carry over.
//   leaving  — the header's content and the rest of the page fade out; the lines start to squiggle.
//   arriving — the header block resizes from the old page's height to this one's, the same lines squiggle
//              into this page's terrain, then the content fades back in.
// The squiggle's phase runs on wall-clock time, so it carries on across the navigation without a jump.
// brand.js adds html.arriving in <head> when we come from another page (content hidden from the first paint);
// nothing here runs for reduced motion.
(() => {
	const html = document.documentElement;
	const hero = document.querySelector('[data-topo="hero"]');
	if (!hero || matchMedia("(prefers-reduced-motion: reduce)").matches) return html.classList.remove("arriving");
	const store = window.NP_STORE;
	const clamp = (v) => Math.min(1, Math.max(0, v));
	const paths = hero.querySelectorAll(".hero-topo path");
	const to = TOPO.gen(TOPO.seedFor(window.PAGE_KEY), true);
	const AMP = 14; // squiggle size (map units) while the page is changing
	const fullWidth = () => hero.offsetWidth >= html.clientWidth - 2; // contact's half-width panel doesn't resize

	// Lines at morph progress e (0 = from, 1 = to) with a wave running along each one; e and amp per ring or shared.
	const draw = (from, e, amp) => {
		const now = Date.now();
		to.forEach((r, ri) => {
			const a = from[ri].pts, b = r.pts, m = new Float32Array(b.length), pts = b.length / 2, ph = ri * 1.7;
			const ei = Array.isArray(e) ? e[ri] : e, ai = Array.isArray(amp) ? amp[ri] : amp;
			for (let i = 0; i < pts; i++) {
				const u = (i / pts) * Math.PI * 2;
				m[i * 2] = a[i * 2] + (b[i * 2] - a[i * 2]) * ei + ai * Math.sin(u * 4 - now / 70 + ph);
				m[i * 2 + 1] = a[i * 2 + 1] + (b[i * 2 + 1] - a[i * 2 + 1]) * ei + ai * Math.cos(u * 3 - now / 85 + ph);
			}
			paths[ri].setAttribute("d", TOPO.d(m));
		});
	};

	// ── arriving ──
	const prev = store.get("np-vt");
	if (html.classList.contains("arriving") && prev && Date.now() - prev.t < 4000) {
		const from = TOPO.gen(TOPO.seedFor(prev.page), true);
		if (prev.h && fullWidth()) {
			const h = hero.offsetHeight;
			hero.style.height = `${prev.h}px`;
			hero.getBoundingClientRect();
			hero.style.transition = "height .9s cubic-bezier(.6, 0, .2, 1)";
			hero.style.height = `${h}px`;
			setTimeout(() => { hero.style.height = hero.style.transition = ""; }, 950);
		}
		// Each line lands with a small overshoot, a little after the previous one; the squiggle dies down as it lands.
		const MORPH = 1150, STAGGER = 250, n = to.length, t0 = performance.now();
		const spring = (p) => (p >= 1 ? 1 : 1 - Math.exp(-5.5 * p) * Math.cos(7.5 * p));
		draw(from, 0, AMP);
		const step = (now) => {
			const t = now - t0, ps = to.map((_, ri) => clamp((t - (ri / n) * STAGGER) / (MORPH - STAGGER)));
			draw(from, ps.map(spring), ps.map((p) => AMP * (1 - p) ** 1.4 + 10 * Math.sin(Math.PI * p) * (1 - p) ** 0.6));
			if (t < MORPH) requestAnimationFrame(step);
			else draw(to, 1, 0);
		};
		requestAnimationFrame(step);
		setTimeout(() => html.classList.remove("arriving"), 700);
	} else html.classList.remove("arriving");

	// ── leaving ──
	const own = (a) => a.origin === location.origin && !a.target && !a.hasAttribute("download") && !/\.(?!html$)\w+$/.test(a.pathname) && !a.pathname.startsWith("/api/") && !(a.pathname === location.pathname && a.search === location.search && a.hash);
	let leaving = false;
	document.addEventListener("click", (e) => {
		const a = e.target.closest("a[href]");
		if (!a || leaving || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !own(a)) return;
		e.preventDefault();
		if (a.href === location.href) return;
		leaving = true;
		const ind = document.querySelector(".nav-ind");
		store.set("np-vt", { t: Date.now(), page: window.PAGE_KEY, h: scrollY < 10 && fullWidth() ? hero.offsetHeight : 0,
			ind: ind && ind.style.opacity === "1" ? { x: ind.style.transform, w: ind.style.width, y: ind.style.getPropertyValue("--y"), h: ind.style.getPropertyValue("--h") } : null });
		html.classList.add("leaving");
		const LEAVE = 420, s0 = performance.now();
		const step = (now) => {
			const k = clamp((now - s0) / LEAVE);
			draw(to, 1, AMP * k * k);
			if (k < 1) requestAnimationFrame(step);
			else location.href = a.href;
		};
		requestAnimationFrame(step);
	});
	// Back/forward cache restores the page as we left it (faded out): bring it back.
	addEventListener("pageshow", (e) => { if (e.persisted) { html.classList.remove("leaving"); leaving = false; draw(to, 1, 0); } });
})();
