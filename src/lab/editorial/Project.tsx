import { Link, Navigate, useParams } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { nextProject, projects } from "../data";
import { EASE, EASE_OUT, Reveal, SplitText } from "../shared";

const EditorialProject = () => {
	const { slug } = useParams({ strict: false }) as { slug: string };
	const p = projects.find((x) => x.slug === slug);
	const strip = useRef<HTMLDivElement>(null);
	const coverRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: coverRef, offset: ["start end", "end start"] });
	const coverY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
	if (!p) return <Navigate to='/editorial' />;
	const next = nextProject(p.slug);
	const n = String(projects.indexOf(p) + 1).padStart(2, "0");

	return (
		<article>
			<header className='px-4 pt-28 md:px-8 md:pt-32'>
				<div className='flex items-center justify-between text-xs uppercase tracking-[0.14em]'>
					<Link to='/editorial' hash='work' className='hover:text-[#dc5c48]'>
						← Back to index
					</Link>
					<span>N°{n} / {String(projects.length).padStart(2, "0")}</span>
				</div>
				<h1 className='font-display mt-8 text-[14vw] font-extrabold uppercase leading-[0.8] tracking-[-0.06em] md:text-[10vw]'>
					<SplitText text={p.name} delay={0.7} stagger={0.03} />
				</h1>
				<motion.p
					className='font-serif-i mt-6 max-w-4xl text-4xl leading-[1.05] text-[#dc5c48] md:text-6xl'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.1, duration: 0.9, ease: EASE_OUT }}>
					{p.tagline}
				</motion.p>
				<dl className='mt-12 grid grid-cols-2 border-t border-[#1d232b] md:grid-cols-4'>
					{[
						["Role", p.role],
						["Year", p.period],
						["Category", p.kind],
						["Website", p.link],
					].map(([k, v], i) => (
						<motion.div
							key={k}
							className='border-b border-[#1d232b]/20 py-4 pr-4 md:border-b-0 md:border-r md:px-4 md:first:pl-0 md:last:border-r-0'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1.2 + i * 0.08 }}>
							<dt className='text-xs uppercase tracking-[0.14em] opacity-60'>{k}</dt>
							<dd className='mt-1 font-medium'>
								{k === "Website" ? (
									v ? (
										<a href={v} target='_blank' rel='noreferrer' className='underline decoration-1 underline-offset-4 hover:text-[#dc5c48]'>
											{v.replace(/^https?:\/\//, "")} ↗
										</a>
									) : (
										"Private / in progress"
									)
								) : (
									v
								)}
							</dd>
						</motion.div>
					))}
				</dl>
			</header>

			{p.cover && (
				<motion.div
					ref={coverRef}
					className='mx-4 mt-12 overflow-hidden rounded-[1.5rem] md:mx-8'
					initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
					animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
					transition={{ delay: 1.3, duration: 1.3, ease: EASE }}>
					<motion.img src={p.cover} alt={`${p.name} screenshot`} style={{ y: coverY, scale: 1.2 }} className='aspect-[16/9] w-full object-cover object-top' />
				</motion.div>
			)}

			<div className='grid gap-12 px-4 py-28 md:grid-cols-12 md:px-8'>
				<aside className='hidden md:col-span-3 md:block'>
					<ul className='sticky top-28 space-y-2 text-sm uppercase tracking-[0.14em]'>
						{["Overview", "Challenge", "What I built", "Stack", "Gallery"].map((s, i) => (
							<li key={s}>
								<a href={`#s${i}`} className='opacity-60 transition-opacity hover:text-[#dc5c48] hover:opacity-100'>
									({String(i + 1).padStart(2, "0")}) {s}
								</a>
							</li>
						))}
					</ul>
				</aside>

				<div className='space-y-28 md:col-span-8 md:col-start-5'>
					<Reveal>
						<section id='s0'>
							<p className='font-serif text-3xl leading-snug first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-8xl first-letter:font-extrabold first-letter:leading-[0.8] first-letter:text-[#dc5c48] md:text-4xl'>
								{p.summary}
							</p>
						</section>
					</Reveal>

					<Reveal>
						<section id='s1' className='relative'>
							<span className='font-serif absolute -left-4 -top-16 text-[12rem] leading-none text-[#dc5c48]/30 md:-left-16'>“</span>
							<blockquote className='font-serif-i relative text-4xl leading-[1.1] md:text-6xl'>{p.challenge}</blockquote>
						</section>
					</Reveal>

					<section id='s2'>
						<p className='mb-8 text-xs uppercase tracking-[0.14em]'>(What I built)</p>
						<ol className='space-y-0'>
							{p.built.map((b, i) => (
								<Reveal key={b.title} delay={i * 0.06}>
									<li className='grid grid-cols-12 gap-4 border-t border-[#1d232b]/20 py-8'>
										<span className='font-serif-i col-span-2 text-5xl text-[#488b9b]'>{i + 1}.</span>
										<div className='col-span-10'>
											<h3 className='font-display text-2xl font-bold tracking-tight md:text-3xl'>{b.title}</h3>
											<p className='mt-2 text-lg opacity-80'>{b.body}</p>
										</div>
									</li>
								</Reveal>
							))}
						</ol>
					</section>

					<section id='s3'>
						<p className='mb-6 text-xs uppercase tracking-[0.14em]'>(Stack)</p>
						<p className='font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-[-0.04em] md:text-6xl'>
							{p.stack.map((s, i) => (
								<motion.span
									key={s}
									className='inline-block'
									initial={{ opacity: 0.1 }}
									whileInView={{ opacity: 1 }}
									viewport={{ once: true }}
									transition={{ delay: i * 0.08 }}>
									{s}
									{i < p.stack.length - 1 && <span className='font-serif-i mx-3 font-normal normal-case text-[#dc5c48]'>&</span>}
								</motion.span>
							))}
						</p>
					</section>

					{p.layers && (
						<section>
							<p className='mb-6 text-xs uppercase tracking-[0.14em]'>(Architecture)</p>
							<div className='grid gap-px overflow-hidden rounded-2xl bg-[#1d232b]/20'>
								{p.layers.map((l, i) => (
									<Reveal key={l.label} delay={i * 0.08} y={20}>
										<div className='grid grid-cols-12 gap-4 bg-[#efe9df] p-5 transition-colors hover:bg-[#1d232b] hover:text-[#efe9df]'>
											<span className='font-serif-i col-span-4 text-2xl text-[#dc5c48] md:col-span-3'>{l.label}</span>
											<span className='col-span-8 md:col-span-9'>{l.value}</span>
										</div>
									</Reveal>
								))}
							</div>
						</section>
					)}
				</div>
			</div>

			{p.gallery.length > 0 && (
				<section id='s4' className='overflow-hidden pb-28'>
					<div className='flex items-end justify-between px-4 pb-6 md:px-8'>
						<p className='text-xs uppercase tracking-[0.14em]'>(Gallery)</p>
						<p className='font-serif-i text-xl'>drag →</p>
					</div>
					<div ref={strip} className='px-4 md:px-8'>
						<motion.div drag='x' dragConstraints={strip} className='flex w-max cursor-grab gap-6 active:cursor-grabbing'>
							{p.gallery.map((g) => (
								<img key={g} src={g} alt='' draggable={false} className='h-[50vh] w-auto rounded-2xl object-cover shadow-xl md:h-[65vh]' />
							))}
						</motion.div>
					</div>
				</section>
			)}

			<Link to='/editorial/work/$slug' params={{ slug: next.slug }} className='group block border-t border-[#1d232b] px-4 py-20 md:px-8'>
				<p className='text-xs uppercase tracking-[0.14em]'>(Next case)</p>
				<p
					className='font-display mt-4 bg-cover bg-center bg-clip-text text-[14vw] font-extrabold uppercase leading-[0.85] tracking-[-0.06em] transition-[color] duration-700 group-hover:text-transparent md:text-[10vw]'
					style={{ backgroundImage: next.cover ? `url(${next.cover})` : undefined }}>
					{next.name}
				</p>
			</Link>
		</article>
	);
};

export default EditorialProject;
