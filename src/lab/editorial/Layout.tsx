import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import Logo from "../../components/Logo";
import { me } from "../data";
import { EASE, usePageBg, useLocalTime } from "../shared";

export const PAPER = "#efe9df";
export const INK = "#1d232b";

const EditorialLayout = () => {
	usePageBg(PAPER);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const time = useLocalTime();
	const nav = [
		{ n: "01", to: "/editorial", label: "Index" },
		{ n: "02", to: "/editorial/about", label: "About" },
		{ n: "03", to: "/editorial/contact", label: "Contact" },
	] as const;

	return (
		<div className='lab-scope min-h-screen overflow-x-clip bg-[#efe9df] text-[#1d232b]'>
			{/* Route curtain: five ink columns drop away one after another */}
			<div key={`curtain${pathname}`} className='pointer-events-none fixed inset-0 z-[80] flex'>
				{Array.from({ length: 5 }).map((_, i) => (
					<motion.div
						key={i}
						className='h-full flex-1 bg-[#1d232b]'
						style={{ originY: 1 }}
						initial={{ scaleY: 1 }}
						animate={{ scaleY: 0 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.07 }}
					/>
				))}
			</div>

			<header className='fixed inset-x-0 top-0 z-50 grid grid-cols-2 items-center gap-4 border-b border-[#1d232b]/15 bg-[#efe9df]/80 px-4 py-3 backdrop-blur-md md:grid-cols-3 md:px-8'>
				<Link to='/editorial' className='flex items-center gap-3'>
					<Logo className='h-9 w-9 text-[#dc5c48]' animateOnMount={false} hoverEraseBorder />
					<span className='text-sm font-semibold tracking-tight'>
						Nicolas Pisar <span className='font-serif-i text-base font-normal text-[#dc5c48]'>©{new Date().getFullYear()}</span>
					</span>
				</Link>
				<nav className='flex justify-end gap-5 text-sm md:justify-center md:gap-8'>
					{nav.map((l) => (
						<Link key={l.to} to={l.to} className='group' activeOptions={{ exact: true }} activeProps={{ className: "text-[#dc5c48]" }}>
							<sup className='mr-1 text-[10px] opacity-60'>({l.n})</sup>
							<span className='relative'>
								{l.label}
								<span className='absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100' />
							</span>
						</Link>
					))}
				</nav>
				<div className='hidden items-center justify-end gap-3 text-sm md:flex'>
					<span className='relative flex h-2 w-2'>
						<span className='lab-pulse absolute inset-0 rounded-full bg-[#488b9b]' />
						<span className='relative h-2 w-2 rounded-full bg-[#488b9b]' />
					</span>
					<span>Isère {time}</span>
				</div>
			</header>

			<motion.main
				key={pathname}
				initial={{ y: 80, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 1, ease: EASE, delay: 0.35 }}>
				<Outlet />
			</motion.main>

			<footer className='overflow-hidden border-t border-[#1d232b]/15 px-4 pt-16 md:px-8'>
				<div className='grid gap-8 text-sm md:grid-cols-4'>
					<p className='font-serif-i text-3xl leading-tight md:col-span-2'>
						Thanks for scrolling this far. <br />
						<Link to='/editorial/contact' className='text-[#dc5c48] underline decoration-1 underline-offset-4'>
							Now say hello →
						</Link>
					</p>
					<ul className='space-y-1'>
						<li><a href={me.links.linkedin} target='_blank' rel='noreferrer' className='hover:text-[#dc5c48]'>LinkedIn ↗</a></li>
						<li><a href={me.links.github} target='_blank' rel='noreferrer' className='hover:text-[#dc5c48]'>GitHub ↗</a></li>
						<li><a href={me.links.instagram} target='_blank' rel='noreferrer' className='hover:text-[#dc5c48]'>Instagram ↗</a></li>
					</ul>
					<ul className='space-y-1'>
						<li>{me.location}</li>
						<li><a href={me.cvUrl} className='hover:text-[#dc5c48]'>Résumé (PDF) ↓</a></li>
					</ul>
				</div>
				<motion.p
					className='font-display mt-16 whitespace-nowrap text-center text-[15.5vw] font-extrabold uppercase leading-[0.78] tracking-[-0.06em]'
					initial={{ y: "40%" }}
					whileInView={{ y: "12%" }}
					viewport={{ once: true }}
					transition={{ duration: 1.2, ease: EASE }}>
					Nicolas Pisar
				</motion.p>
			</footer>
		</div>
	);
};

export default EditorialLayout;
