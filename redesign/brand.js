// Draws the official logo into [data-logo] and the hexagon-cut portrait into [data-portrait], runs the menu
// indicator, and sets up page transitions (page key, hidden-content flag). Loaded in <head>.
// Paths copied from src/components/Logo.tsx (218×218 box).
const HEX = "M24.34,70.3c-0.04-4.4,3.03-9.83,6.82-12.06l69.23-40.78c3.79-2.23,10.03-2.29,13.86-0.12l69.94,39.57 c3.83,2.17,6.99,7.54,7.03,11.94l0.7,80.35c0.04,4.4-3.03,9.83-6.82,12.06l-69.23,40.78c-3.79,2.23-10.03,2.29-13.86,0.12 l-69.94-39.57c-3.83-2.17-6.99-7.54-7.03-11.94L24.34,70.3z";
const MARK = "M60.5,73.5c6.51-1.73,47.4-31.21,28.5,0.5c-11.22,18.83-21.87,35-21.87,35s-3.38,3.78-0.38,6c2.99,2.21,4.25,4.75,7.75,1 s22-30.75,36.25-43.5s11.2-3.65,1.94,8.69c-9.43,12.56-15.44,26.06-16.69,33.56s-2.43,16.01,14.75,9 c29.83-12.18,41.1-8.28,47.23-2.87c4.47,3.95,5.81,15.96-11.84,25.85c-12.22,6.85-23.92,3.14-23.92,3.14l4.07-7.39 c0,0,10.58-20.04,14.77-28.35c4.59-9.09,0.94-6.47-8.33,7.39c-5.02,7.5-14.17,21.26-14.17,21.26s-31.82,8.62-11.19,18.32 c0.38,0.18-7.51,10.69-9.58,17.68c-1.59,5.34,3.31,8.32,8.05,4.83c11.11-8.17,3.83-11.53,3.83-11.53l5.55-9.33 c0,0,36.15,2.51,51.82-18.44c15.79-21.1-3.33-34.96-9.38-37.17c-4.86-1.78-12.98-6.73-42.65,2.6c-5.83,1.83-7.98-0.02-2.98-8.85 s9.51-12.79,18.77-25.84c12.56-17.72,1.77-31.89-11.76-22.55c-8.1,5.59-41.21,50-41.21,50s20.44-34.81,24.4-41.24 c3.37-5.48,6.27-18.99-9.4-14.93c-4.5,1.17-8.73,2.18-19.17,8.5c-3.82,2.31-0.38-3.15-0.38-3.15C67.95,54.2,43.58,77.27,60.5,73.5z";

// ── Page transitions (transit.js does the animation) ──
// PAGE_KEY seeds each page's header terrain; project pages get one per project.
const PAGE = location.pathname.split("/").pop().replace(".html", "") || "index";
window.PAGE_KEY = PAGE === "project" ? `project:${new URLSearchParams(location.search).get("p")}` : PAGE;
const store = { get: (k) => { try { return JSON.parse(sessionStorage.getItem(k)); } catch { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {} } };
window.NP_STORE = store;
// The logo draws itself on the first page of a visit only, not on every navigation.
if (store.get("np-seen")) document.documentElement.classList.add("seen");
store.set("np-seen", true);
// Arriving from another page of the site: keep the content hidden from the first paint; transit.js resizes the
// header block, squiggles the lines into place, then fades the content in.
const vt = store.get("np-vt");
if (vt && Date.now() - vt.t < 4000 && vt.page !== window.PAGE_KEY && !matchMedia("(prefers-reduced-motion: reduce)").matches) document.documentElement.classList.add("arriving");

const logo = `<svg viewBox="0 0 218 218" aria-hidden="true"><path class="hexp" pathLength="1" d="${HEX}" fill="none" stroke="currentColor" stroke-width="6"/><path class="markp" d="${MARK}" fill="currentColor"/></svg>`;
// Hexagon bbox in the logo box: x 24–192, y 17–202, centre ≈ (108, 110).
const portrait = (src) => `<svg viewBox="0 0 218 218" role="img" aria-label="Portrait de Nicolas Pisar">
	<defs><clipPath id="hexclip"><path d="${HEX}"/></clipPath></defs>
	<path class="ring" pathLength="1" d="${HEX}" transform="translate(108 110) scale(1.08) translate(-108 -110)"/>
	<image href="${src}" x="20" y="14" width="176" height="192" preserveAspectRatio="xMidYMid slice" clip-path="url(#hexclip)"/>
</svg>`;

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll("[data-logo]").forEach((el) => el.insertAdjacentHTML("afterbegin", logo));
	document.querySelectorAll("[data-portrait]").forEach((el) => (el.innerHTML = portrait(el.dataset.portrait)));
	// Menu: one indicator slides to the hovered link and back to the current page's link.
	const nav = document.querySelector(".nav");
	if (nav) {
		const ind = Object.assign(document.createElement("span"), { className: "nav-ind" });
		nav.prepend(ind);
		const links = [...nav.querySelectorAll("a:not(.btn)")];
		const cur = links.find((a) => a.hasAttribute("aria-current"));
		const go = (a) => {
			ind.style.opacity = a ? 1 : 0;
			if (!a) return;
			ind.style.width = `${a.offsetWidth}px`;
			ind.style.transform = `translateX(${a.offsetLeft}px)`;
			ind.style.setProperty("--y", `${a.offsetTop}px`);
			ind.style.setProperty("--h", `${a.offsetHeight}px`);
		};
		links.forEach((a) => ["mouseenter", "focus"].forEach((e) => a.addEventListener(e, () => go(a))));
		nav.addEventListener("mouseleave", () => go(cur));
		nav.addEventListener("focusout", (e) => !nav.contains(e.relatedTarget) && go(cur));
		addEventListener("resize", () => go(cur));
		addEventListener("load", () => go(cur)); // after the webfonts, so widths are right
		// Coming from another page: start where the old page's indicator was, then slide to this page's link.
		const prev = store.get("np-vt");
		const from = prev && Date.now() - prev.t < 4000 && prev.ind;
		ind.classList.add("still");
		if (from) Object.assign(ind.style, { opacity: 1, width: from.w, transform: from.x }), ind.style.setProperty("--y", from.y), ind.style.setProperty("--h", from.h);
		else go(cur);
		requestAnimationFrame(() => requestAnimationFrame(() => { ind.classList.remove("still"); go(cur); }));
	}
	// Service cards: icon strokes get pathLength=1 and class "st" so CSS can draw them (a class, because Chrome
	// doesn't restyle SVG children reliably on [pathLength] selectors); cards rise in and draw their icon
	// the first time they scroll into view, then the hover redraw takes over (motion.css).
	// Any [data-reveal] block gets the same rise-in, child by child.
	const cards = document.querySelectorAll(".svc article, [data-reveal] > *");
	cards.forEach((card) => {
		card.querySelectorAll(".ico :is(path, rect, circle):not([stroke='none']):not(clipPath *)").forEach((el) => { el.setAttribute("pathLength", "1"); el.classList.add("st"); });
		card.style.setProperty("--i", [...card.parentElement.children].indexOf(card));
	});
	// Client strip: a second copy of the list makes the scroll loop seamless (hidden from screen readers).
	document.querySelectorAll(".marquee ul").forEach((ul) => {
		const copy = ul.cloneNode(true);
		copy.setAttribute("aria-hidden", "true");
		copy.querySelectorAll("a").forEach((a) => (a.tabIndex = -1));
		ul.after(copy);
	});
	// Contact form: ?besoin=site (from the landing page's shortcuts) ticks the matching choice.
	const need = new URLSearchParams(location.search).get("besoin");
	const pick = need && document.querySelector(`.pick input[value="${CSS.escape(need)}"]`);
	if (pick) pick.checked = true;
	if (cards.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
		cards.forEach((c) => c.classList.add("pre"));
		const io = new IntersectionObserver((entries) => entries.forEach((e) => {
			if (!e.isIntersecting && e.boundingClientRect.top > 0) return; // also reveal anything scrolled past too fast
			io.unobserve(e.target);
			e.target.classList.replace("pre", "in");
			setTimeout(() => e.target.classList.remove("in"), 2200);
		}), { threshold: 0.25 });
		cards.forEach((c) => io.observe(c));
	}
});
