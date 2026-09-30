import { Link, Navigate, useParams } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { nextProject, useContent } from "./data";
import { EASE_OUT, Reveal, SplitText } from "./shared";

/**
 * Justified bento tile: width grows with the image's aspect ratio at a fixed row height,
 * so rows always fill, phone shots stay slim and nothing gets cropped.
 */
const Shot = ({ src, i, onOpen }: { src: string; i: number; onOpen: (src: string) => void }) => {
	const [ratio, setRatio] = useState(1.5);
	return (
		<div className='h-[170px] md:h-[300px]' style={{ flexGrow: ratio, flexBasis: `calc(${ratio} * var(--row))` }}>
			<Reveal delay={(i % 3) * 0.08} className='h-full'>
				<button
					onClick={() => onOpen(src)}
					className='group flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-ig-fg/10 bg-ig-panel p-3 transition-colors hover:border-[#dc5c48]/50 md:p-5'>
					<motion.img
						layoutId={src}
						src={src}
						alt=''
						loading='lazy'
						onLoad={(e) => setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
						className='max-h-full max-w-full rounded-lg object-contain transition-transform duration-700 group-hover:scale-[1.04]'
					/>
				</button>
			</Reveal>
		</div>
	);
};

const IgniteProject = () => {
	const { slug } = useParams({ strict: false }) as { slug: string };
	const { projects, ui } = useContent();
	const p = projects.find((x) => x.slug === slug);
	const coverRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: coverRef, offset: ["start end", "center center"] });
	const clip = useTransform(scrollYProgress, [0, 1], ["inset(12% 10% 12% 10% round 48px)", "inset(0% 0% 0% 0% round 24px)"]);
	const imgScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
	const [open, setOpen] = useState<string | null>(null);
	useEffect(() => {
		const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
		window.addEventListener("keydown", esc);
		return () => window.removeEventListener("keydown", esc);
	}, []);
	if (!p) return <Navigate to='/' />;
	const next = nextProject(p.slug, projects);

	return (
		<article>
			<header className='relative px-4 pb-16 pt-36 md:px-8 md:pt-44'>
				<div className='pointer-events-none absolute right-0 top-0 h-[50vmax] w-[50vmax] rounded-full blur-[140px]' style={{ background: `${p.accent}22` }} />
				<motion.p
					className='font-mono text-xs uppercase tracking-[0.2em] text-ig-fg/60'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.8 }}>
					{ui.caseStudy} — {ui.kinds[p.kind]}
				</motion.p>
				<h1 className='font-unbounded mt-6 text-[13vw] font-black uppercase leading-[0.85] md:text-[9vw]'>
					<SplitText text={p.name} delay={0.7} stagger={0.03} />
				</h1>
				<motion.p
					className='mt-8 max-w-3xl text-2xl leading-snug text-ig-fg/80 md:text-4xl'
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.1, duration: 0.9, ease: EASE_OUT }}>
					{p.tagline}
				</motion.p>
				<motion.dl
					className='mt-14 grid grid-cols-2 gap-6 border-t border-ig-fg/10 pt-6 md:grid-cols-4'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.3 }}>
					{[
						[ui.role, p.role],
						[ui.period, p.period],
						[ui.type, ui.kinds[p.kind]],
						[ui.live, p.link ? p.link.replace(/^https?:\/\//, "") : ui.private],
					].map(([k, v]) => (
						<div key={k}>
							<dt className='font-mono text-[11px] uppercase tracking-[0.2em] text-ig-fg/40'>{k}</dt>
							<dd className='mt-2 text-ig-fg/90'>
								{k === ui.live && p.link ? (
									<a href={p.link} target='_blank' rel='noreferrer' className='text-[#dc5c48] hover:underline'>
										{v} ↗
									</a>
								) : (
									v
								)}
							</dd>
						</div>
					))}
				</motion.dl>
			</header>

			{p.cover && (
				<div ref={coverRef} className='px-4 md:px-8'>
					<motion.div style={{ clipPath: clip }} className='overflow-hidden'>
						<motion.img src={p.cover} alt={`${p.name} screenshot`} style={{ scale: imgScale }} className='max-h-[90vh] w-full object-cover object-top' />
					</motion.div>
				</div>
			)}

			<section className='grid gap-12 px-4 py-32 md:grid-cols-12 md:px-8'>
				<Reveal className='md:col-span-4'>
					<p className='font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48]'>{ui.overview}</p>
				</Reveal>
				<div className='space-y-10 md:col-span-8'>
					<Reveal>
						<p className='text-2xl leading-snug md:text-3xl'>{p.summary}</p>
					</Reveal>
					<Reveal delay={0.1}>
						<div className='rounded-2xl border border-[#dc5c48]/30 bg-[#dc5c48]/5 p-6 md:p-8'>
							<p className='font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48]'>{ui.challenge}</p>
							<p className='mt-3 text-lg text-ig-fg/80 md:text-xl'>{p.challenge}</p>
						</div>
					</Reveal>
				</div>
			</section>

			{p.metrics && (
				<section className='grid grid-cols-3 border-y border-ig-fg/10'>
					{p.metrics.map((m, i) => (
						<Reveal key={m.label} delay={i * 0.1} className='border-ig-fg/10 p-6 md:p-12 [&:not(:last-child)]:border-r'>
							<div className='font-unbounded text-4xl font-black text-[#dc5c48] md:text-8xl'>{m.value}</div>
							<p className='mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ig-fg/60'>{m.label}</p>
						</Reveal>
					))}
				</section>
			)}

			<section className='px-4 py-32 md:px-8'>
				<p className='mb-12 font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48]'>{ui.built}</p>
				{p.built.map((b) => (
					<Reveal key={b.title}>
						<div className='group grid gap-4 border-t border-ig-fg/10 py-10 transition-colors hover:bg-ig-fg/[0.02] md:grid-cols-12'>
							<h3 className='font-unbounded text-2xl font-black uppercase transition-colors group-hover:text-[#dc5c48] md:col-span-6 md:text-4xl'>{b.title}</h3>
							<p className='text-lg text-ig-fg/70 md:col-span-6'>{b.body}</p>
						</div>
					</Reveal>
				))}
			</section>

			{p.layers && (
				<section className='px-4 pb-32 md:px-8'>
					<p className='mb-12 font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48]'>{ui.architecture}</p>
					<div className='relative mx-auto max-w-3xl'>
						<svg className='absolute left-8 top-0 h-full w-2 overflow-visible' aria-hidden>
							<line x1='1' y1='0' x2='1' y2='100%' stroke='#dc5c48' strokeWidth='2' strokeDasharray='6 10' className='fx-dash' />
						</svg>
						{p.layers.map((l, i) => (
							<Reveal key={l.label} delay={i * 0.12} className='relative mb-5 pl-20'>
								<span className='absolute left-[25px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#dc5c48] shadow-[0_0_24px_#dc5c48]' />
								<div className='rounded-2xl border border-ig-fg/10 bg-ig-panel p-5 transition-transform hover:translate-x-2'>
									<p className='font-mono text-[11px] uppercase tracking-[0.2em] text-[#dc5c48]'>{l.label}</p>
									<p className='mt-1 text-lg'>{l.value}</p>
								</div>
							</Reveal>
						))}
					</div>
				</section>
			)}

			{p.gallery.length > 0 && (
				<section className='px-4 pb-32 md:px-8'>
					<p className='mb-12 font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48]'>{ui.screens}</p>
					<div className='flex flex-wrap gap-4 [--row:170px] md:[--row:300px]'>
						{p.gallery.map((g, i) => (
							<Shot key={g} src={g} i={i} onOpen={setOpen} />
						))}
						{/* soaks up the last row so a lone tile doesn't stretch full width */}
						<div className='h-0 grow-[3]' />
					</div>
				</section>
			)}

			<AnimatePresence>
				{open && (
					<motion.div
						className='fixed inset-0 z-[85] flex items-center justify-center bg-ig-bg/90 p-4 backdrop-blur-md md:p-12'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setOpen(null)}>
						<motion.img layoutId={open} src={open} alt='' className='max-h-full max-w-full rounded-xl object-contain' />
					</motion.div>
				)}
			</AnimatePresence>

			<section className='px-4 pb-32 md:px-8'>
				<p className='mb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48]'>{ui.stack}</p>
				<div className='flex flex-wrap gap-3'>
					{p.stack.map((s, i) => (
						<motion.span
							key={s}
							className='rounded-full border border-ig-fg/15 px-5 py-2 text-lg'
							initial={{ opacity: 0, scale: 0.6 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							whileHover={{ scale: 1.08, backgroundColor: "#dc5c48", color: "#0b0c0f" }}
							transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 18 }}>
							{s}
						</motion.span>
					))}
				</div>
			</section>

			<Link to='/work/$slug' params={{ slug: next.slug }} className='group relative block overflow-hidden border-t border-ig-fg/10 px-4 py-24 md:px-8 md:py-40'>
				{next.cover && (
					<img src={next.cover} alt='' className='absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-25' />
				)}
				<p className='relative font-mono text-xs uppercase tracking-[0.2em] text-ig-fg/50'>{ui.nextProject}</p>
				<h2 className='font-unbounded relative mt-4 text-[12vw] font-black uppercase leading-none transition-colors group-hover:text-[#dc5c48] md:text-[8vw]'>
					{next.name} →
				</h2>
			</Link>
		</article>
	);
};

export default IgniteProject;
