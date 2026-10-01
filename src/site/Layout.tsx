import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "framer-motion";
import { createContext, useEffect, useState, type MouseEvent } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import Logo from "../components/Logo";
import { useTranslation } from "react-i18next";
import { useDocumentMeta } from "../i18n/useDocumentMeta";
import { useContent } from "./data";
import { EASE, Marquee, usePageBg } from "./shared";

/** Per-route title/description for search results and social cards (home uses the site defaults). */
const clip = (s: string, n = 158) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const pageMeta = (
	pathname: string,
	c: { ui: { nav: { about: string; contact: string }; caseStudy: string }; projects: { slug: string; name: string; tagline: string; summary: string }[]; about: string; availability: string },
) => {
	const suffix = " — Nicolas Pisar";
	if (pathname.startsWith("/about")) return { title: c.ui.nav.about + suffix, description: clip(c.about), path: "/about" };
	if (pathname.startsWith("/contact")) return { title: c.ui.nav.contact + suffix, description: clip(c.availability), path: "/contact" };
	const p = pathname.startsWith("/work/") && c.projects.find((x) => pathname === `/work/${x.slug}`);
	if (p) return { title: `${p.name} — ${c.ui.caseStudy}${suffix}`, description: clip(`${p.tagline} ${p.summary}`), path: pathname };
	return { path: "/" };
};

export type Theme = "dark" | "light";
export const IgniteTheme = createContext<Theme>("dark");
/** Particle-logo palette per theme: deeper tones so the dots hold up on the light background. */
export const PARTICLES: Record<Theme, { colors: string[]; hex: string; dot: number }> = {
	dark: { colors: ["#dc5c48", "#e8836f", "#b79a77"], hex: "#488b9b", dot: 1 },
	light: { colors: ["#dc5c48", "#c74936", "#8f6f49"], hex: "#2f6f7e", dot: 1.6 },
};
const PAGE_BG: Record<Theme, string> = { dark: "#0b0c0f", light: "#f4efe7" };
const THEME_KEY = "igniteTheme";

// Theme switch timings (ms): flight from the toggle, shockwave spread, per-dot jitter, swell to a full cell, shrink away.
const FLY = 420;
const WAVE = 320;
const JITTER = 140;
const SWELL = 180;
const SHRINK = 240;
let bursting = false;
/**
 * The site explodes into the logo's dots: thousands of them shoot out of (x, y), land on a grid and swell
 * until the screen is solid `bg`; `swap` runs under that cover, then the dots shrink away over the new theme.
 */
const themeBurst = (x: number, y: number, bg: string, accents: string[], swap: () => void) => {
	if (bursting) return;
	bursting = true;
	const w = innerWidth;
	const h = innerHeight;
	const dpr = Math.min(devicePixelRatio || 1, 2);
	const canvas = document.createElement("canvas");
	canvas.width = w * dpr;
	canvas.height = h * dpr;
	// above the page and its overlays, below the custom cursor
	canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:89;pointer-events:none";
	document.body.append(canvas);
	const ctx = canvas.getContext("2d")!;
	ctx.scale(dpr, dpr);
	const g = Math.max(12, Math.round(Math.sqrt((w * h) / 9000))); // ~9k dots on any screen
	const far = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
	const parts: { hx: number; hy: number; d: number; c: number; px: number; py: number; s: number }[] = [];
	for (let gy = 0; gy < h; gy += g)
		for (let gx = 0; gx < w; gx += g) {
			const hx = gx + g / 2;
			const hy = gy + g / 2;
			parts.push({ hx, hy, d: (Math.hypot(hx - x, hy - y) / far) * WAVE + Math.random() * JITTER, c: (Math.random() * accents.length) | 0, px: 0, py: 0, s: 0 });
		}
	const cover = FLY + WAVE + JITTER + SWELL;
	const end = cover + WAVE + JITTER + SHRINK;
	const clamp = (v: number) => Math.min(1, Math.max(0, v));
	const t0 = performance.now();
	let swapped = false;
	const frame = (now: number) => {
		const t = now - t0;
		if (t >= cover && !swapped) {
			swapped = true;
			swap();
		}
		if (t >= end) {
			canvas.remove();
			bursting = false;
			return;
		}
		ctx.clearRect(0, 0, w, h);
		for (const p of parts) {
			if (t < cover) {
				const k = 1 - (1 - clamp((t - p.d) / FLY)) ** 4; // fast out of the toggle, easing into place
				p.px = x + (p.hx - x) * k;
				p.py = y + (p.hy - y) * k;
				p.s = t < p.d ? 0 : 3 + (g - 2) * clamp((t - p.d - FLY) / SWELL) ** 2;
			} else {
				p.px = p.hx;
				p.py = p.hy;
				p.s = (g + 1) * (1 - clamp((t - cover - p.d) / SHRINK) ** 2);
			}
		}
		// big dots are the new background; small ones (in flight, or nearly gone) are logo-coloured sparks
		const draw = (color: string, pick: (p: (typeof parts)[number]) => boolean) => {
			ctx.fillStyle = color;
			for (const p of parts) if (p.s > 0.4 && pick(p)) ctx.fillRect(p.px - p.s / 2, p.py - p.s / 2, p.s, p.s);
		};
		draw(bg, (p) => p.s > 5);
		accents.forEach((color, i) => draw(color, (p) => p.s <= 5 && p.c === i));
		requestAnimationFrame(frame);
	};
	requestAnimationFrame(frame);
};

/** Saved choice, else the OS preference. */
const useTheme = () => {
	const [theme, setTheme] = useState<Theme>(() => {
		try {
			const saved = localStorage.getItem(THEME_KEY);
			if (saved === "dark" || saved === "light") return saved;
		} catch {
			/* storage blocked */
		}
		return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
	});

	const toggle = (e: MouseEvent) => {
		const next: Theme = theme === "dark" ? "light" : "dark";
		const apply = () => {
			setTheme(next);
			try {
				localStorage.setItem(THEME_KEY, next);
			} catch {
				/* storage blocked */
			}
		};
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
		themeBurst(e.clientX, e.clientY, PAGE_BG[next], [...PARTICLES[next].colors, PARTICLES[next].hex], apply);
	};
	return { theme, toggle };
};

const Cursor = () => {
	const x = useSpring(-100, { stiffness: 500, damping: 40 });
	const y = useSpring(-100, { stiffness: 500, damping: 40 });
	const rx = useSpring(-100, { stiffness: 140, damping: 18 });
	const ry = useSpring(-100, { stiffness: 140, damping: 18 });
	const [hot, setHot] = useState(false);
	const [fine, setFine] = useState(false);
	useEffect(() => {
		setFine(window.matchMedia("(pointer: fine)").matches);
		const move = (e: PointerEvent) => {
			x.set(e.clientX);
			y.set(e.clientY);
			rx.set(e.clientX);
			ry.set(e.clientY);
			setHot(!!(e.target as Element).closest?.("a,button,[data-hot]"));
		};
		window.addEventListener("pointermove", move);
		return () => window.removeEventListener("pointermove", move);
	}, [x, y, rx, ry]);
	if (!fine) return null;
	return (
		<>
			<motion.div className='pointer-events-none fixed left-0 top-0 z-[90] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dc5c48]' style={{ x, y }} />
			<motion.div
				className='pointer-events-none fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#dc5c48] mix-blend-difference'
				style={{ x: rx, y: ry }}
				animate={{ width: hot ? 72 : 34, height: hot ? 72 : 34, backgroundColor: hot ? "#dc5c48" : "rgba(0,0,0,0)" }}
				transition={{ duration: 0.25 }}
			/>
		</>
	);
};

const IgniteLayout = () => {
	const { theme, toggle } = useTheme();
	// Frosted nav once content scrolls under it, so links stay readable over any section.
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	usePageBg(PAGE_BG[theme]);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { i18n } = useTranslation();
	const { me, ui, lang, projects } = useContent();
	useDocumentMeta(pageMeta(pathname, { ui, projects, about: ui.aboutP1, availability: me.availability }));
	const [menuOpen, setMenuOpen] = useState(false);
	// phone menu: the tapped link plays its animation, then we navigate (the coral page wipe takes over)
	const navigate = useNavigate();
	const reduceMotion = useReducedMotion();
	const [picked, setPicked] = useState<string | null>(null);
	useEffect(() => {
		if (!menuOpen) setPicked(null);
	}, [menuOpen]);
	const pick = (l: { to: string; hash?: string }) => (e: MouseEvent) => {
		e.preventDefault();
		if (picked) return;
		const go = () => {
			navigate({ to: l.to, hash: l.hash });
			setMenuOpen(false);
		};
		if (reduceMotion) return go();
		setPicked(l.to);
		window.setTimeout(go, 800);
	};
	// close the phone menu on navigation, and stop the page scrolling underneath it
	useEffect(() => setMenuOpen(false), [pathname]);
	useEffect(() => {
		document.body.style.overflow = menuOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);
	// "Work" covers the home page and every case study
	const isActive = (to: string) => (to === "/" ? pathname === "/" || pathname.startsWith("/work/") : pathname.startsWith(to));
	const themeButton = (
		<button onClick={toggle} className='text-base text-ig-fg' aria-label={theme === "dark" ? "Light theme" : "Dark theme"}>
			{theme === "dark" ? <FiSun /> : <FiMoon />}
		</button>
	);
	const langSwitch = (
		<div className='flex items-center gap-1 text-ig-fg' role='group' aria-label='Language'>
			{(["en", "fr"] as const).map((l, i) => (
				<span key={l} className='flex items-center gap-1'>
					{i > 0 && <span className='text-ig-fg/30'>/</span>}
					<button
						onClick={() => i18n.changeLanguage(l)}
						aria-pressed={lang === l}
						className={`uppercase transition-opacity ${lang === l ? "opacity-100" : "opacity-40 hover:opacity-80"}`}>
						{l}
					</button>
				</span>
			))}
		</div>
	);
	const links = [
		{ to: "/", label: ui.nav.work, hash: "work" },
		{ to: "/about", label: ui.nav.about },
		{ to: "/contact", label: ui.nav.contact },
	] as const;

	return (
		<div data-theme={theme} className='ignite site fx-grain min-h-screen overflow-x-clip bg-ig-bg text-ig-fg md:cursor-none [&_a]:md:cursor-none [&_button]:md:cursor-none'>
			<Cursor />

			{/* Route wipe: a coral sheet covers the swap then lifts away */}
			<motion.div
				key={`wipe${pathname}`}
				className='pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-[#dc5c48]'
				style={{ originY: 0 }}
				initial={{ scaleY: 1 }}
				animate={{ scaleY: 0 }}
				transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}>
				<motion.div initial={{ opacity: 1, scale: 1 }} animate={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.3 }}>
					<Logo className='h-24 w-24 text-[#0b0c0f]' animateOnMount={false} />
				</motion.div>
			</motion.div>

			<header
				className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 transition-[background-color,backdrop-filter,border-color] duration-300 md:px-8 ${
					scrolled && !menuOpen ? "border-b border-ig-fg/10 bg-ig-bg/70 backdrop-blur-xl" : "border-b border-transparent"
				}`}>
				<Link to='/' className='flex items-center gap-3' aria-label='Home'>
					<Logo className='h-11 w-11 text-[#dc5c48]' animateOnMount={false} hoverEraseBorder />
					<span className='hidden font-mono text-xs uppercase tracking-[0.2em] text-ig-fg/70 sm:block'>{me.name}</span>
				</Link>
				<nav className='hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.18em] md:flex'>
					{links.map((l) => (
						<Link
							key={l.label}
							to={l.to}
							hash={"hash" in l ? l.hash : undefined}
							aria-current={isActive(l.to) ? "page" : undefined}
							className={`group relative transition-colors ${isActive(l.to) ? "text-[#dc5c48]" : "text-ig-fg hover:text-[#dc5c48]"}`}>
							{l.label}
							<span
								className={`absolute -bottom-1 left-0 h-px w-full bg-current transition-transform duration-500 ${
									isActive(l.to) ? "scale-x-100" : "origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100"
								}`}
							/>
						</Link>
					))}
					{themeButton}
					{langSwitch}
				</nav>
				{/* phones: one button, full-screen menu */}
				<button
					onClick={() => setMenuOpen((o) => !o)}
					aria-expanded={menuOpen}
					aria-controls='mobile-menu'
					aria-label={menuOpen ? "Close menu" : "Open menu"}
					className='relative flex h-11 w-11 items-center justify-center rounded-full border border-ig-fg/15 md:hidden'>
					<motion.span className='absolute h-px w-5 bg-ig-fg' animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} />
					<motion.span className='absolute h-px w-5 bg-ig-fg' animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} />
				</button>
			</header>

			<AnimatePresence>
				{menuOpen && (
					<motion.div
						id='mobile-menu'
						className='fixed inset-0 z-[45] flex flex-col bg-ig-bg px-6 pb-10 pt-24 md:hidden'
						initial={{ clipPath: "circle(0% at calc(100% - 38px) 38px)" }}
						animate={{ clipPath: "circle(150% at calc(100% - 38px) 38px)" }}
						exit={{ clipPath: "circle(0% at calc(100% - 38px) 38px)" }}
						transition={{ duration: 0.6, ease: EASE }}>
						{/* language + theme, right under the logo / close row so they're easy to find */}
						<motion.div
							className='mb-10 flex items-center justify-between gap-3 border-b border-ig-fg/10 pb-6'
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.4 }}>
							<div role='group' aria-label='Language' className='flex rounded-full border border-ig-fg/15 p-1 font-mono text-sm uppercase tracking-[0.14em]'>
								{(["en", "fr"] as const).map((l) => (
									<button
										key={l}
										onClick={() => i18n.changeLanguage(l)}
										aria-pressed={lang === l}
										className={`relative rounded-full px-5 py-2 uppercase transition-colors ${lang === l ? "text-[#0b0c0f]" : "text-ig-fg/70"}`}>
										{lang === l && <motion.span layoutId='menu-lang' className='absolute inset-0 rounded-full bg-[#dc5c48]' transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
										<span className='relative'>{l}</span>
									</button>
								))}
							</div>
							<button
								onClick={(e) => {
									// the burst covers the screen; the menu folds away underneath it
									toggle(e);
									setMenuOpen(false);
								}}
								className='flex items-center gap-2 rounded-full border border-ig-fg/15 px-4 py-2.5 font-mono text-sm uppercase tracking-[0.14em] text-ig-fg [&>*]:shrink-0'>
								{theme === "dark" ? <FiSun /> : <FiMoon />}
								{theme === "dark" ? ui.themeLight : ui.themeDark}
							</button>
						</motion.div>
						<nav className='flex flex-col gap-2'>
							{links.map((l, i) => {
								const chosen = picked === l.to;
								return (
									<motion.div
										key={l.label}
										initial={{ opacity: 0, y: 30 }}
										// the others slide away while the chosen one plays its moment
										animate={picked && !chosen ? { opacity: 0, x: -48, y: 0 } : { opacity: 1, x: 0, y: 0 }}
										transition={{ delay: picked ? 0 : 0.15 + i * 0.07, duration: picked ? 0.3 : 0.5 }}>
										<Link
											to={l.to}
											hash={"hash" in l ? l.hash : undefined}
											onClick={pick(l)}
											aria-current={isActive(l.to) ? "page" : undefined}
											className={`font-unbounded relative inline-block py-2 text-[min(12vw,3.5rem)] font-black uppercase ${isActive(l.to) ? "text-[#dc5c48]" : "text-ig-fg"}`}>
											{/* coral marker sweeps behind the word… */}
											<motion.span
												aria-hidden
												className='absolute inset-y-1 -left-2 -right-3 origin-left rounded-sm bg-[#dc5c48]'
												initial={{ scaleX: 0 }}
												animate={{ scaleX: chosen ? 1 : 0 }}
												transition={{ duration: 0.35, ease: EASE }}
											/>
											{/* …and the letters ripple up, one after another */}
											<span className='relative'>
												{[...l.label].map((c, j) => (
													<motion.span
														key={j}
														className='inline-block'
														animate={chosen ? { y: [0, -16, 0], color: "#0b0c0f" } : { y: 0 }}
														transition={{ delay: 0.12 + j * 0.035, duration: 0.42, ease: "easeOut" }}>
														{c === " " ? "\u00a0" : c}
													</motion.span>
												))}
											</span>
										</Link>
									</motion.div>
								);
							})}
						</nav>
					</motion.div>
				)}
			</AnimatePresence>

			<main key={pathname}>
				<IgniteTheme.Provider value={theme}>
					<Outlet />
				</IgniteTheme.Provider>
			</main>

			<footer className='border-t border-ig-fg/10'>
				<Link to='/contact' className='block py-10 transition-colors hover:text-[#dc5c48]'>
					<Marquee speed={22}>
						{Array.from({ length: 4 }).map((_, i) => (
							<span key={i} className='font-unbounded px-6 text-[12vw] font-black uppercase leading-none md:text-[8vw]'>
								<span className='inline-flex items-center gap-[0.3em]'>
									{ui.footerMarquee} <Logo className='fx-spin h-[0.75em] w-[0.75em] text-[#dc5c48] [animation-duration:8s]' animateOnMount={false} />
								</span>
							</span>
						))}
					</Marquee>
				</Link>
				<div className='flex flex-col gap-3 px-4 pb-8 font-mono text-xs uppercase tracking-[0.16em] text-ig-fg/50 md:flex-row md:justify-between md:px-8'>
					<span>© {new Date().getFullYear()} {me.name} — {me.location}</span>
					<div className='flex gap-6'>
						<a href={me.links.github} target='_blank' rel='noreferrer' className='hover:text-ig-fg'>GitHub</a>
						<a href={me.links.linkedin} target='_blank' rel='noreferrer' className='hover:text-ig-fg'>LinkedIn</a>
						<a href={me.cvUrl} className='hover:text-ig-fg'>{ui.cv}</a>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default IgniteLayout;
