import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "framer-motion";
import { createContext, useEffect, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
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

/** Koch subdivision: every edge sprouts a spike, `depth` times over. `spike` 0 = flat, 1 = classic snowflake, more = sharper shards. */
const koch = (pts: number[][], spike: number, depth: number): number[][] =>
	depth === 0
		? pts
		: koch(
				pts.flatMap(([ax, ay], i) => {
					const [bx, by] = pts[(i + 1) % pts.length];
					const dx = (bx - ax) / 3;
					const dy = (by - ay) / 3;
					const h = (spike * Math.sqrt(3)) / 2;
					return [
						[ax, ay],
						[ax + dx, ay + dy],
						[ax + 1.5 * dx + dy * h, ay + 1.5 * dy - dx * h],
						[ax + 2 * dx, ay + 2 * dy],
					];
				}),
				spike,
				depth - 1,
			);
const BURST_SPIKE = 1.5;
/** The logo's pointy-top hexagon at (x, y), radius r, as a clip-path with fractal edges. Same point count at any spike, so keyframes interpolate. */
const burst = (x: number, y: number, r: number, spike: number, rot: number) => {
	const hex = Array.from({ length: 6 }, (_, k) => {
		const a = rot - Math.PI / 2 + (k * Math.PI) / 3;
		return [Math.cos(a), Math.sin(a)];
	});
	return `polygon(${koch(hex, spike, 3)
		.map(([px, py]) => `${(x + r * px).toFixed(1)}px ${(y + r * py).toFixed(1)}px`)
		.join(",")})`;
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

	// The new theme bursts out of the toggle as the logo hexagon going fractal (View Transitions; instant where unsupported).
	const toggle = (e: MouseEvent) => {
		const next: Theme = theme === "dark" ? "light" : "dark";
		const apply = () => {
			flushSync(() => setTheme(next));
			try {
				localStorage.setItem(THEME_KEY, next);
			} catch {
				/* storage blocked */
			}
		};
		if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
		const { clientX: x, clientY: y } = e;
		// /0.866: the hexagon's flat sides, not just its corners, must clear the farthest viewport corner
		const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) / 0.866;
		document.startViewTransition(apply).ready.then(() =>
			document.documentElement.animate(
				{
					// logo hexagon pops, then spins a sixth of a turn while its edges shatter into spikes
					clipPath: [burst(x, y, 0, 0, 0), burst(x, y, r * 0.12, 0, 0), burst(x, y, r, BURST_SPIKE, Math.PI / 3)],
					offset: [0, 0.3, 1],
				},
				{ duration: 1000, easing: "cubic-bezier(.76,0,.24,1)", pseudoElement: "::view-transition-new(root)" },
			),
		);
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
								onClick={toggle}
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
