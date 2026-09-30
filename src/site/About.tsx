import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FiCompass, FiSearch, FiTool, FiUsers, FiWind, FiZap } from "react-icons/fi";
import { stack, useContent } from "./data";
import { EASE_OUT, HEX_CLIP as HEX, Magnetic, Reveal, SplitText } from "./shared";

const HOBBY_ICONS = { wind: FiWind, tool: FiTool, zap: FiZap, compass: FiCompass, users: FiUsers, search: FiSearch };

const IgniteAbout = () => {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
	const rotate = useTransform(scrollYProgress, [0, 1], [0, 60]);
	const photoY = useTransform(scrollYProgress, [0, 1], [0, 120]);
	const { me, ui, history, projects, education, hobbies } = useContent();

	return (
		<>
			<section ref={ref} className='relative grid min-h-screen items-center gap-12 px-4 pb-20 pt-32 md:grid-cols-2 md:px-8'>
				<div>
					<p className='font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48]'>{ui.about}</p>
					<h1 className='font-unbounded mt-6 text-6xl font-black uppercase leading-[0.9] md:text-8xl'>
						<SplitText key={ui.hi} text={ui.hi} delay={0.7} />
						<br />
						<span className='text-[#dc5c48]'>
							<SplitText text={me.first} delay={0.95} />
						</span>
					</h1>
					<motion.div
						className='mt-10 max-w-xl space-y-5 text-lg text-ig-fg/75'
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1.3, duration: 0.9, ease: EASE_OUT }}>
						<p>{ui.aboutP1}</p>
						<p>{ui.aboutP2}</p>
					</motion.div>
					<Magnetic className='mt-10'>
						<a href={me.cvUrl} className='inline-flex items-center gap-3 rounded-full border border-ig-fg/20 px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:border-[#dc5c48] hover:bg-[#dc5c48] hover:text-[#0b0c0f]'>
							{ui.downloadCv}
						</a>
					</Magnetic>
				</div>

				<motion.div className='relative mx-auto aspect-square w-[80vw] max-w-[520px]' style={{ y: photoY }}>
					<motion.div className='absolute inset-[-6%]' style={{ rotate, clipPath: HEX }}>
						<div className='h-full w-full bg-[conic-gradient(from_0deg,#dc5c48,#488b9b,#b79a77,#dc5c48)]' />
					</motion.div>
					<motion.img
						src={me.photo}
						alt={me.name}
						className='absolute inset-0 h-full w-full object-cover'
						style={{ clipPath: HEX }}
						initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
						animate={{ scale: 1, opacity: 1, rotate: 0 }}
						transition={{ delay: 0.8, type: "spring", stiffness: 80, damping: 14 }}
					/>
				</motion.div>
			</section>

			<section className='px-4 py-24 md:px-8'>
				<h2 className='font-unbounded mb-16 text-5xl font-black uppercase md:text-8xl'>{ui.timeline}</h2>
				{history.map((h) => (
					<Reveal key={h.company + h.title}>
						<div className='group grid gap-3 border-t border-ig-fg/10 py-10 md:grid-cols-12 md:gap-8'>
							<div className='flex items-center gap-3 md:col-span-2 md:flex-col md:items-start'>
								<p className='font-mono text-sm text-ig-fg/50'>{h.period}</p>
								<span className='rounded-full border border-[#dc5c48]/40 px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#dc5c48]'>{h.tag}</span>
							</div>
							<div className='md:col-span-4'>
								<h3 className='font-unbounded text-3xl font-black uppercase transition-colors group-hover:text-[#dc5c48] md:text-4xl'>{h.company}</h3>
								<p className='mt-1 text-[#dc5c48]'>{h.title}</p>
							</div>
							<div className='md:col-span-6'>
								<p className='text-lg text-ig-fg/80'>{h.body}</p>
								<ul className='mt-4 space-y-2'>
									{h.points.map((pt) => (
										<li key={pt} className='relative pl-5 text-ig-fg/65 before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#dc5c48]'>
											{pt}
										</li>
									))}
								</ul>
								{h.slug && (
									<Link to='/work/$slug' params={{ slug: h.slug }} className='mt-5 inline-block font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48] hover:underline'>
										{ui.caseStudyLink}
									</Link>
								)}
							</div>
						</div>
					</Reveal>
				))}
			</section>

			<section className='px-4 py-24 md:px-8'>
				<h2 className='font-unbounded mb-12 text-5xl font-black uppercase md:text-8xl'>{ui.education}</h2>
				{education.map((e) => (
					<Reveal key={e.school}>
						<div className='grid gap-3 border-t border-ig-fg/10 py-10 md:grid-cols-12 md:gap-8'>
							<p className='font-mono text-sm text-ig-fg/50 md:col-span-2'>{e.period}</p>
							<div className='md:col-span-4'>
								<h3 className='font-unbounded text-3xl font-black uppercase md:text-4xl'>{e.school}</h3>
								<p className='mt-1 text-[#dc5c48]'>{e.title}</p>
							</div>
							<p className='text-lg text-ig-fg/70 md:col-span-6'>{e.body}</p>
						</div>
					</Reveal>
				))}
			</section>

			<section className='px-4 py-24 md:px-8'>
				<h2 className='font-unbounded mb-12 text-5xl font-black uppercase md:text-8xl'>{ui.allWork}</h2>
				{(["Product", "Freelance", "Tool"] as const).map((kind) => (
					<div key={kind} className='mb-14'>
						<p className='mb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48]'>{ui.kindHeadings[kind]}</p>
						<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
							{projects
								.filter((p) => p.kind === kind)
								.map((p, i) => (
									<Reveal key={p.slug} delay={(i % 3) * 0.08}>
										<Link to='/work/$slug' params={{ slug: p.slug }} className='group block overflow-hidden rounded-2xl border border-ig-fg/10 bg-ig-panel'>
											<div className='aspect-[16/10] overflow-hidden'>
												{p.cover && <img src={p.cover} alt='' loading='lazy' className='h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110' />}
											</div>
											<div className='flex items-center justify-between p-5'>
												<div>
													<h3 className='font-unbounded text-xl font-black uppercase'>{p.name}</h3>
													<p className='text-sm text-ig-fg/50'>{p.role}</p>
												</div>
												<span className='text-2xl transition-transform group-hover:translate-x-1 group-hover:text-[#dc5c48]'>→</span>
											</div>
										</Link>
									</Reveal>
								))}
						</div>
					</div>
				))}
			</section>

			<section className='px-4 py-24 md:px-8'>
				<h2 className='font-unbounded mb-12 text-5xl font-black uppercase md:text-8xl'>{ui.toolbox}</h2>
				<div className='flex flex-wrap gap-3'>
					{stack.map((s, i) => (
						<motion.span
							key={s}
							drag
							dragSnapToOrigin
							className='cursor-grab rounded-full border border-ig-fg/15 px-6 py-3 text-xl active:cursor-grabbing'
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							whileHover={{ backgroundColor: "#dc5c48", color: "#0b0c0f" }}
							transition={{ delay: i * 0.03 }}>
							{s}
						</motion.span>
					))}
				</div>
				<p className='mt-6 font-mono text-xs uppercase tracking-[0.2em] text-ig-fg/40'>{ui.throw}</p>
			</section>

			<section className='px-4 py-24 md:px-8'>
				<h2 className='font-unbounded text-5xl font-black uppercase md:text-8xl'>{ui.hobbies}</h2>
				<p className='mb-12 mt-4 text-lg text-ig-fg/60'>{ui.hobbiesIntro}</p>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{hobbies.map((h, i) => {
						const Icon = HOBBY_ICONS[h.icon as keyof typeof HOBBY_ICONS] ?? FiZap;
						const card = (
							<div className='group h-full rounded-2xl border border-ig-fg/10 bg-ig-panel p-6 transition-colors hover:border-[#dc5c48]/60'>
								<Icon className='text-3xl text-[#dc5c48] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110' />
								<h3 className='font-unbounded mt-5 text-xl font-black uppercase'>{h.title}</h3>
								<p className='mt-2 text-ig-fg/65'>{h.body}</p>
								{h.slug && <p className='mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48]'>{ui.moreLink}</p>}
							</div>
						);
						return (
							<Reveal key={h.title} delay={(i % 3) * 0.08}>
								{h.slug ? (
									<Link to='/work/$slug' params={{ slug: h.slug }} className='block h-full'>
										{card}
									</Link>
								) : (
									card
								)}
							</Reveal>
						);
					})}
				</div>
			</section>
		</>
	);
};

export default IgniteAbout;
