import { Link, Navigate, useParams } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { nextProject, projects } from "../data";
import { EASE_OUT, Reveal } from "../shared";
import { Tile, Tilt } from "./Layout";

const BentoProject = () => {
	const { slug } = useParams({ strict: false }) as { slug: string };
	const p = projects.find((x) => x.slug === slug);
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
	const rotateX = useTransform(scrollYProgress, [0, 1], [28, 0]);
	const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
	const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
	if (!p) return <Navigate to='/bento' />;
	const next = nextProject(p.slug);

	return (
		<article>
			<header className='mx-auto max-w-4xl pt-10 text-center md:pt-16'>
				<motion.div className='flex flex-wrap justify-center gap-2' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
					{[p.kind, p.period, p.role].map((c) => (
						<span key={c} className='rounded-full border border-white/70 bg-white/60 px-3 py-1 text-sm font-semibold backdrop-blur'>
							{c}
						</span>
					))}
				</motion.div>
				<motion.h1
					className='font-display mt-6 text-6xl font-extrabold tracking-[-0.045em] md:text-8xl'
					initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					transition={{ delay: 0.3, duration: 0.9, ease: EASE_OUT }}>
					{p.name}
				</motion.h1>
				<motion.p
					className='mx-auto mt-5 max-w-2xl text-xl text-[#1d232b]/70 md:text-2xl'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}>
					{p.tagline}
				</motion.p>
				{p.link && (
					<motion.a
						href={p.link}
						target='_blank'
						rel='noreferrer'
						className='mt-8 inline-block rounded-full bg-[#1d232b] px-6 py-3 font-semibold text-white'
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						whileHover={{ scale: 1.06 }}
						transition={{ delay: 0.75, type: "spring" }}>
						Visit {p.link.replace(/^https?:\/\//, "")} ↗
					</motion.a>
				)}
			</header>

			{p.cover && (
				<div ref={ref} className='mt-14 [perspective:1200px]'>
					<motion.div style={{ rotateX, scale, y }} className='mx-auto max-w-6xl origin-bottom rounded-[32px] border border-white/70 bg-white/60 p-2 shadow-[0_60px_120px_-40px_rgba(29,35,43,.5)] backdrop-blur-xl md:p-3'>
						<div className='flex items-center gap-1.5 px-3 pb-2 pt-1'>
							<span className='h-3 w-3 rounded-full bg-[#ff5f57]' />
							<span className='h-3 w-3 rounded-full bg-[#febc2e]' />
							<span className='h-3 w-3 rounded-full bg-[#28c840]' />
						</div>
						<img src={p.cover} alt={`${p.name} screenshot`} className='w-full rounded-[22px]' />
					</motion.div>
				</div>
			)}

			<section className='mt-20 grid gap-4 md:grid-cols-3'>
				<Reveal className='md:col-span-2'>
					<Tile className='h-full p-7 md:p-10'>
						<p className='font-mono text-xs uppercase tracking-[0.14em] text-[#1d232b]/60'>Overview</p>
						<p className='mt-4 text-xl leading-relaxed md:text-2xl'>{p.summary}</p>
					</Tile>
				</Reveal>
				<Reveal delay={0.1}>
					<div className='h-full rounded-[28px] bg-[#1d232b] p-7 text-white md:p-10'>
						<p className='font-mono text-xs uppercase tracking-[0.14em] text-[#dc5c48]'>The challenge</p>
						<p className='mt-4 text-lg leading-relaxed text-white/85'>{p.challenge}</p>
					</div>
				</Reveal>
				{p.metrics?.map((m, i) => (
					<Reveal key={m.label} delay={i * 0.08}>
						<Tile className='p-7'>
							<p className='font-display text-5xl font-extrabold tracking-tight text-[#dc5c48]'>{m.value}</p>
							<p className='mt-1 text-[#1d232b]/60'>{m.label}</p>
						</Tile>
					</Reveal>
				))}
			</section>

			<section className='mt-20'>
				<h2 className='font-display mb-6 px-2 text-4xl font-extrabold tracking-[-0.035em] md:text-5xl'>What I built</h2>
				<div className='grid gap-4 md:grid-cols-2'>
					{p.built.map((b, i) => (
						<Reveal key={b.title} delay={(i % 2) * 0.1}>
							<Tile className='h-full p-7' glow={i % 2 ? "rgba(72,139,155,.25)" : undefined}>
								<span className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d232b] font-mono text-sm text-white transition-colors group-hover:bg-[#dc5c48]'>0{i + 1}</span>
								<h3 className='font-display mt-5 text-2xl font-extrabold tracking-tight'>{b.title}</h3>
								<p className='mt-2 text-[#1d232b]/70'>{b.body}</p>
							</Tile>
						</Reveal>
					))}
				</div>
			</section>

			{p.layers && (
				<section className='mt-20'>
					<h2 className='font-display mb-6 px-2 text-4xl font-extrabold tracking-[-0.035em] md:text-5xl'>Under the hood</h2>
					<Tile className='p-6 md:p-10'>
						<div className='flex flex-col items-stretch gap-0 md:flex-row md:items-center'>
							{p.layers.map((l, i) => (
								<div key={l.label} className='flex flex-1 flex-col items-center md:flex-row'>
									<Reveal delay={i * 0.12} y={20} className='w-full'>
										<div className='rounded-2xl border border-[#1d232b]/10 bg-white/80 p-4 text-center'>
											<p className='font-mono text-[11px] uppercase tracking-[0.14em] text-[#dc5c48]'>{l.label}</p>
											<p className='mt-1 text-sm'>{l.value}</p>
										</div>
									</Reveal>
									{i < p.layers!.length - 1 && (
										<svg className='h-8 w-4 shrink-0 md:h-4 md:w-8' viewBox='0 0 32 32' preserveAspectRatio='none' aria-hidden>
											<line x1='16' y1='0' x2='16' y2='32' className='md:hidden lab-dash' stroke='#dc5c48' strokeWidth='3' strokeDasharray='4 6' />
											<line x1='0' y1='16' x2='32' y2='16' className='hidden md:block lab-dash' stroke='#dc5c48' strokeWidth='3' strokeDasharray='4 6' />
										</svg>
									)}
								</div>
							))}
						</div>
					</Tile>
				</section>
			)}

			<section className='mt-20'>
				<Tile className='p-7'>
					<p className='font-mono text-xs uppercase tracking-[0.14em] text-[#1d232b]/60'>Stack</p>
					<div className='mt-4 flex flex-wrap gap-2'>
						{p.stack.map((s, i) => (
							<motion.span
								key={s}
								className='rounded-full bg-[#1d232b] px-4 py-2 text-sm font-semibold text-white'
								initial={{ opacity: 0, y: 20, scale: 0.8 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ once: true }}
								whileHover={{ y: -4, backgroundColor: "#dc5c48" }}
								transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 18 }}>
								{s}
							</motion.span>
						))}
					</div>
				</Tile>
			</section>

			{p.gallery.length > 0 && (
				<section className='mt-20 columns-1 gap-4 md:columns-2'>
					{p.gallery.map((g, i) => (
						<Reveal key={g} delay={(i % 2) * 0.1} className='mb-4 break-inside-avoid'>
							<Tilt max={5} className='overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_60px_-30px_rgba(29,35,43,.35)]'>
								<img src={g} alt='' loading='lazy' className='w-full' />
							</Tilt>
						</Reveal>
					))}
				</section>
			)}

			<Link to='/bento/work/$slug' params={{ slug: next.slug }} className='mt-20 block'>
				<Tilt max={4} className='overflow-hidden rounded-[28px] bg-[#1d232b] text-white'>
					<div className='grid items-center gap-6 p-7 md:grid-cols-2 md:p-10'>
						<div>
							<p className='font-mono text-xs uppercase tracking-[0.14em] text-[#dc5c48]'>Next project</p>
							<p className='font-display mt-3 text-5xl font-extrabold tracking-[-0.04em] md:text-7xl'>{next.name} →</p>
							<p className='mt-3 text-white/60'>{next.tagline}</p>
						</div>
						{next.cover && <img src={next.cover} alt='' className='rounded-2xl transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1' />}
					</div>
				</Tilt>
			</Link>
		</article>
	);
};

export default BentoProject;
