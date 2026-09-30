import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "../../components/Logo";
import { useTranslation } from "react-i18next";
import { useDocumentMeta } from "../../i18n/useDocumentMeta";
import { useLab } from "../data";
import { EASE, Marquee, usePageBg } from "../shared";

const BG = "#0b0c0f";

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
	usePageBg(BG);
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
		<div className='lab-scope lab-grain min-h-screen overflow-x-clip bg-[#0b0c0f] text-[#f1ece4] md:cursor-none [&_a]:md:cursor-none [&_button]:md:cursor-none'>
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

			<header className='fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 mix-blend-difference md:px-8'>
				<Link to='/ignite' className='flex items-center gap-3' aria-label='Home'>
					<Logo className='h-11 w-11 text-[#dc5c48]' animateOnMount={false} hoverEraseBorder />
					<span className='hidden font-mono text-xs uppercase tracking-[0.2em] text-white/70 sm:block'>{me.name}</span>
				</Link>
				<nav className='flex items-center gap-5 font-mono text-xs uppercase tracking-[0.18em] md:gap-8'>
					{links.map((l) => (
						<Link
							key={l.label}
							to={l.to}
							hash={"hash" in l ? l.hash : undefined}
							className='group relative text-white'
							activeOptions={{ exact: true, includeHash: false }}>
							{l.label}
							<span className='absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100' />
						</Link>
					))}
					<div className='flex items-center gap-1 text-white' role='group' aria-label='Language'>
						{(["en", "fr"] as const).map((l, i) => (
							<span key={l} className='flex items-center gap-1'>
								{i > 0 && <span className='text-white/30'>/</span>}
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
				<Outlet />
			</main>

			<footer className='border-t border-white/10'>
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
				<div className='flex flex-col gap-3 px-4 pb-8 font-mono text-xs uppercase tracking-[0.16em] text-white/50 md:flex-row md:justify-between md:px-8'>
					<span>© {new Date().getFullYear()} {me.name} — {me.location}</span>
					<div className='flex gap-6'>
						<a href={me.links.github} target='_blank' rel='noreferrer' className='hover:text-white'>GitHub</a>
						<a href={me.links.linkedin} target='_blank' rel='noreferrer' className='hover:text-white'>LinkedIn</a>
						<a href={me.cvUrl} className='hover:text-white'>{ui.cv}</a>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default IgniteLayout;
