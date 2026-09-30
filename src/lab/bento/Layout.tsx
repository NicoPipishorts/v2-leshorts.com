import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import Logo from "../../components/Logo";
import { me } from "../data";
import { EASE_OUT, usePageBg } from "../shared";

/** Glass tile with a cursor spotlight. */
export const Tile = ({ children, className = "", glow = "rgba(220,92,72,.18)" }: { children: ReactNode; className?: string; glow?: string }) => {
	const mx = useMotionValue(-200);
	const my = useMotionValue(-200);
	const bg = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, ${glow}, transparent 70%)`;
	return (
		<div
			onMouseMove={(e: MouseEvent<HTMLDivElement>) => {
				const r = e.currentTarget.getBoundingClientRect();
				mx.set(e.clientX - r.left);
				my.set(e.clientY - r.top);
			}}
			onMouseLeave={() => {
				mx.set(-200);
				my.set(-200);
			}}
			className={`group relative overflow-hidden rounded-[28px] border border-white/70 bg-white/55 shadow-[0_20px_60px_-30px_rgba(29,35,43,.35)] backdrop-blur-xl ${className}`}>
			{/* -z-10 inside the backdrop-filter stacking context: above the glass, below the content */}
			<motion.div className='pointer-events-none absolute inset-0 -z-10' style={{ background: bg }} />
			{children}
		</div>
	);
};

/** 3D tilt with a moving glare highlight. */
export const Tilt = ({ children, className = "", max = 10 }: { children: ReactNode; className?: string; max?: number }) => {
	const px = useMotionValue(0.5);
	const py = useMotionValue(0.5);
	const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
	const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
	const gx = useTransform(px, [0, 1], ["0%", "100%"]);
	const gy = useTransform(py, [0, 1], ["0%", "100%"]);
	const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,.45), transparent 55%)`;
	return (
		<motion.div
			style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
			onMouseMove={(e) => {
				const r = e.currentTarget.getBoundingClientRect();
				px.set((e.clientX - r.left) / r.width);
				py.set((e.clientY - r.top) / r.height);
			}}
			onMouseLeave={() => {
				px.set(0.5);
				py.set(0.5);
			}}
			className={`group relative ${className}`}>
			{children}
			<motion.div className='pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100' style={{ background: glare }} />
		</motion.div>
	);
};

const NAV = [
	{ to: "/bento", label: "Home" },
	{ to: "/bento/about", label: "About" },
	{ to: "/bento/contact", label: "Contact" },
] as const;

const BentoLayout = () => {
	usePageBg("#f4efe9");
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const active = NAV.find((n) => n.to === pathname)?.to ?? (pathname.includes("/work/") ? "/bento" : "");

	return (
		<div className='lab-scope relative min-h-screen overflow-x-clip bg-[#f4efe9] text-[#1d232b]'>
			{/* living gradient mesh */}
			<div className='pointer-events-none fixed inset-0 overflow-hidden'>
				<div className='lab-blob absolute -left-[10%] -top-[10%] h-[55vmax] w-[55vmax] rounded-full bg-[#dc5c48]/35 blur-[110px]' />
				<div className='lab-blob absolute -right-[15%] top-[20%] h-[50vmax] w-[50vmax] rounded-full bg-[#488b9b]/35 blur-[110px] [animation-delay:-6s]' />
				<div className='lab-blob absolute bottom-[-20%] left-[25%] h-[45vmax] w-[45vmax] rounded-full bg-[#b79a77]/40 blur-[110px] [animation-delay:-12s]' />
			</div>

			<header className='fixed inset-x-0 top-4 z-50 flex justify-center px-3'>
				<motion.nav
					initial={{ y: -80, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.8, ease: EASE_OUT }}
					className='flex items-center gap-1 rounded-full border border-white/70 bg-white/60 p-1.5 shadow-[0_10px_40px_-15px_rgba(29,35,43,.3)] backdrop-blur-xl'>
					<Link to='/bento' className='mr-1 flex h-10 w-10 items-center justify-center' aria-label='Home'>
						<Logo className='h-9 w-9 text-[#dc5c48]' animateOnMount={false} hoverEraseBorder />
					</Link>
					{NAV.map((n) => (
						<Link key={n.to} to={n.to} className='relative rounded-full px-4 py-2 text-sm font-semibold'>
							{active === n.to && (
								<motion.span layoutId='bento-nav' className='absolute inset-0 rounded-full bg-[#1d232b]' transition={{ type: "spring", stiffness: 400, damping: 32 }} />
							)}
							<span className={`relative transition-colors ${active === n.to ? "text-white" : ""}`}>{n.label}</span>
						</Link>
					))}
					<a href={me.cvUrl} className='ml-1 hidden rounded-full bg-[#dc5c48] px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 sm:block'>
						CV ↓
					</a>
				</motion.nav>
			</header>

			<motion.main
				key={pathname}
				className='relative px-3 pb-10 pt-24 md:px-6'
				initial={{ opacity: 0, scale: 0.97, filter: "blur(12px)" }}
				// filter must end as "none" or it becomes a backdrop root and kills the glass blur
				animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
				transition={{ duration: 0.7, ease: EASE_OUT }}>
				<div className='mx-auto max-w-7xl'>
					<Outlet />
				</div>
			</motion.main>

			<footer className='relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 pb-8 text-sm text-[#1d232b]/60 md:flex-row'>
				<span>© {new Date().getFullYear()} {me.name} · crafted in {me.location}</span>
				<span className='flex gap-5'>
					<a href={me.links.github} target='_blank' rel='noreferrer' className='hover:text-[#dc5c48]'>GitHub</a>
					<a href={me.links.linkedin} target='_blank' rel='noreferrer' className='hover:text-[#dc5c48]'>LinkedIn</a>
					<a href={me.links.instagram} target='_blank' rel='noreferrer' className='hover:text-[#dc5c48]'>Instagram</a>
				</span>
			</footer>
		</div>
	);
};

export default BentoLayout;
