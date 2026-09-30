import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { history, me, stack } from "../data";
import { EASE, Reveal, SplitText } from "../shared";

const EditorialAbout = () => {
	const ref = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
	const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

	return (
		<>
			<section ref={ref} className='relative grid gap-8 overflow-hidden px-4 pt-28 md:grid-cols-12 md:px-8 md:pt-32'>
				<div className='md:col-span-7'>
					<p className='text-xs uppercase tracking-[0.14em]'>(About)</p>
					<h1 className='font-serif mt-6 text-[16vw] leading-[0.85] md:text-[9vw]'>
						<SplitText text='A developer' by='word' delay={0.7} />
						<br />
						<span className='font-serif-i text-[#dc5c48]'>
							<SplitText text='who ships.' by='word' delay={0.9} />
						</span>
					</h1>
				</div>
				<motion.div
					className='relative md:col-span-5'
					initial={{ clipPath: "inset(100% 0 0 0)" }}
					animate={{ clipPath: "inset(0% 0 0 0)" }}
					transition={{ delay: 1, duration: 1.2, ease: EASE }}>
					<div className='absolute inset-x-0 bottom-0 top-[18%] rounded-t-full bg-[#dc5c48]' />
					<motion.img src={me.cutoutColor} alt={me.name} style={{ y }} className='relative w-full' />
				</motion.div>
			</section>

			<section className='border-y border-[#1d232b] px-4 py-20 md:px-8'>
				<Reveal>
					<div className='gap-12 text-lg leading-relaxed md:columns-2 md:text-xl'>
						<p className='mb-6 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:font-extrabold first-letter:leading-[0.8] first-letter:text-[#dc5c48]'>
							I started coding in 2001 and never really stopped. Over the last decade I’ve specialised in the frontend — React, TypeScript,
							component architecture, state management, responsive UI systems, performance and accessibility — while keeping enough backend,
							data and infrastructure in my hands to ship whole products.
						</p>
						<p className='mb-6'>
							After InterCloud, where I helped a SaaS network-deployment dashboard go from proof of concept to V1, I moved into entrepreneurship:
							co-founding Kaast, a media platform now used by 4,000+ people across 5 companies, running my studio Vue d’Esprit, and building Synqit.
						</p>
						<p className='mb-6'>
							I use AI tools every day — Claude Code, Codex, Cursor — for prototyping, review and documentation. Assisted, never delegated: taste and
							ownership stay with me.
						</p>
						<p>
							Off-screen I fly paragliders, skate, restore wood and preside the parents’ association of my kids’ school — where, naturally, I also
							wrote the software.
						</p>
					</div>
				</Reveal>
			</section>

			<section className='px-4 py-28 md:px-8'>
				<h2 className='font-display mb-10 text-6xl font-extrabold uppercase tracking-[-0.05em] md:text-9xl'>Ledger</h2>
				{history.map((h, i) => (
					<Reveal key={h.company + h.title} delay={i * 0.04}>
						<div className='grid gap-3 border-t border-[#1d232b] py-8 md:grid-cols-12'>
							<p className='font-serif-i text-2xl text-[#488b9b] md:col-span-2'>{h.period}</p>
							<div className='md:col-span-4'>
								<h3 className='font-display text-3xl font-extrabold uppercase tracking-tight'>{h.company}</h3>
								<p className='font-serif-i text-xl text-[#dc5c48]'>{h.title}</p>
							</div>
							<p className='text-lg opacity-80 md:col-span-5 md:col-start-8'>
								{h.body}{" "}
								{h.slug && (
									<Link to='/editorial/work/$slug' params={{ slug: h.slug }} className='whitespace-nowrap underline decoration-1 underline-offset-4 hover:text-[#dc5c48]'>
										Case study →
									</Link>
								)}
							</p>
						</div>
					</Reveal>
				))}
			</section>

			<section className='grid gap-10 bg-[#1d232b] px-4 py-28 text-[#efe9df] md:grid-cols-12 md:px-8'>
				<div className='md:col-span-4'>
					<p className='text-xs uppercase tracking-[0.14em] opacity-60'>(Toolbox)</p>
					<p className='font-serif-i mt-4 text-5xl leading-none'>Things I reach for.</p>
					<a href={me.cvUrl} className='mt-10 inline-flex items-center gap-3 rounded-full bg-[#dc5c48] px-6 py-3 text-sm uppercase tracking-[0.14em] text-[#1d232b] transition-transform hover:scale-105'>
						Download résumé ↓
					</a>
				</div>
				<ul className='grid grid-cols-2 gap-x-8 md:col-span-7 md:col-start-6 md:grid-cols-3'>
					{stack.map((s, i) => (
						<motion.li
							key={s}
							className='border-b border-[#efe9df]/15 py-3 text-xl'
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.03 }}>
							<span className='mr-3 text-xs opacity-40'>{String(i + 1).padStart(2, "0")}</span>
							{s}
						</motion.li>
					))}
				</ul>
			</section>
		</>
	);
};

export default EditorialAbout;
