import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import { EASE_OUT, usePageBg } from "./shared";

const DIRECTIONS = [
	{
		to: "/ignite",
		name: "Ignite",
		blurb: "Dark, kinetic, loud. Your logo rebuilt from 3,000 particles you can blow up, pinned horizontal case-study reel, coral route wipes, custom cursor.",
		bg: "#0b0c0f",
		fg: "#f1ece4",
		font: "font-unbounded font-black uppercase",
	},
	{
		to: "/editorial",
		name: "Editorial",
		blurb: "Warm paper, giant type, serif italics. Magazine-style index with cursor-following previews, spinning badge, fill-in-the-blanks letter that flies away as a paper plane.",
		bg: "#efe9df",
		fg: "#1d232b",
		font: "font-serif-i",
	},
	{
		to: "/bento",
		name: "Bento",
		blurb: "Soft glass on a living gradient. The hero is a bento grid that assembles itself, 3D-tilt cards with glare, scroll-flattening device mockups and a chat-style contact.",
		bg: "linear-gradient(135deg,#f6d8cf,#d8ecef 55%,#efe4d4)",
		fg: "#1d232b",
		font: "font-display font-extrabold",
	},
];

const LabIndex = () => {
	usePageBg("#111");
	return (
		<main className='lab-scope min-h-screen bg-[#111] px-4 py-16 text-white md:px-10'>
			<div className='mx-auto max-w-6xl'>
				<div className='flex items-center gap-4'>
					<Logo className='h-14 w-14 text-[#dc5c48]' />
					<div>
						<h1 className='font-display text-3xl font-bold'>Portfolio lab</h1>
						<p className='text-white/50'>Three directions — same content, same palette. Each is multi-page: home · work/:slug · about · contact.</p>
					</div>
				</div>
				<div className='mt-12 grid gap-6 md:grid-cols-3'>
					{DIRECTIONS.map((d, i) => (
						<motion.div key={d.to} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.12, duration: 0.8, ease: EASE_OUT }}>
							<Link to={d.to} className='group block overflow-hidden rounded-3xl border border-white/10 transition-transform duration-500 hover:-translate-y-2'>
								<div className='flex aspect-[4/5] flex-col justify-between p-6' style={{ background: d.bg, color: d.fg }}>
									<span className='font-mono text-xs uppercase tracking-[0.2em] opacity-60'>0{i + 1}</span>
									<span className={`text-6xl leading-none transition-transform duration-500 group-hover:scale-105 ${d.font}`}>{d.name}</span>
								</div>
								<div className='bg-[#181818] p-6'>
									<p className='text-sm leading-relaxed text-white/70'>{d.blurb}</p>
									<span className='mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48]'>Open {d.to} →</span>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</main>
	);
};

export default LabIndex;
