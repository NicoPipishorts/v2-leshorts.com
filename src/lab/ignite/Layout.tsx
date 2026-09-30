import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion, useSpring } from "framer-motion";
import { createContext, useEffect, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import Logo from "../../components/Logo";
import { useTranslation } from "react-i18next";
import { useDocumentMeta } from "../../i18n/useDocumentMeta";
import { useLab } from "../data";
import { EASE, Marquee, usePageBg } from "../shared";

export type Theme = "dark" | "light";
export const IgniteTheme = createContext<Theme>("dark");
/** Particle-logo palette per theme: deeper tones so the dots hold up on the light background. */
export const PARTICLES: Record<Theme, { colors: string[]; hex: string; dot: number }> = {
	dark: { colors: ["#dc5c48", "#e8836f", "#b79a77"], hex: "#488b9b", dot: 1 },
	light: { colors: ["#dc5c48", "#c74936", "#8f6f49"], hex: "#2f6f7e", dot: 1.6 },
};
const PAGE_BG: Record<Theme, string> = { dark: "#0b0c0f", light: "#f4efe7" };
const THEME_KEY = "igniteTheme";

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

	// The new theme grows out of the toggle as a circle (View Transitions; instant where unsupported).
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
		const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
		document.startViewTransition(apply).ready.then(() =>
			document.documentElement.animate(
				{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
				{ duration: 750, easing: "cubic-bezier(.76,0,.24,1)", pseudoElement: "::view-transition-new(root)" },
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
	usePageBg(PAGE_BG[theme]);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	useDocumentMeta();
	const { i18n } = useTranslation();
	const { me, ui, lang } = useLab();
	const links = [
		{ to: "/ignite", label: ui.nav.work, hash: "work" },
		{ to: "/ignite/about", label: ui.nav.about },
		{ to: "/ignite/contact", label: ui.nav.contact },
	] as const;

	return (
		<div data-theme={theme} className='ignite lab-scope lab-grain min-h-screen overflow-x-clip bg-ig-bg text-ig-fg md:cursor-none [&_a]:md:cursor-none [&_button]:md:cursor-none'>
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

			<header className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 ${theme === "dark" ? "mix-blend-difference" : ""}`}>
				<Link to='/ignite' className='flex items-center gap-3' aria-label='Home'>
					<Logo className='h-11 w-11 text-[#dc5c48]' animateOnMount={false} hoverEraseBorder />
					<span className='hidden font-mono text-xs uppercase tracking-[0.2em] text-ig-fg/70 sm:block'>{me.name}</span>
				</Link>
				<nav className='flex items-center gap-5 font-mono text-xs uppercase tracking-[0.18em] md:gap-8'>
					{links.map((l) => (
						<Link
							key={l.label}
							to={l.to}
							hash={"hash" in l ? l.hash : undefined}
							className='group relative text-ig-fg'
							activeOptions={{ exact: true, includeHash: false }}>
							{l.label}
							<span className='absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-ig-fg transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100' />
						</Link>
					))}
					<button onClick={toggle} className='text-base text-ig-fg' aria-label={theme === "dark" ? "Light theme" : "Dark theme"}>
						{theme === "dark" ? <FiSun /> : <FiMoon />}
					</button>
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
				</nav>
			</header>

			<main key={pathname}>
				<IgniteTheme.Provider value={theme}>
					<Outlet />
				</IgniteTheme.Provider>
			</main>

			<footer className='border-t border-ig-fg/10'>
				<Link to='/ignite/contact' className='block py-10 transition-colors hover:text-[#dc5c48]'>
					<Marquee speed={22}>
						{Array.from({ length: 4 }).map((_, i) => (
							<span key={i} className='font-unbounded px-6 text-[12vw] font-black uppercase leading-none md:text-[8vw]'>
								<span className='inline-flex items-center gap-[0.3em]'>
									{ui.footerMarquee} <Logo className='lab-spin h-[0.75em] w-[0.75em] text-[#dc5c48] [animation-duration:8s]' animateOnMount={false} />
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
