import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Logo from "../../components/Logo";
import { history, me, projects, stack } from "../data";
import { Counter, EASE_OUT, Marquee, Reveal, useLocalTime } from "../shared";
import { Tile, Tilt } from "./Layout";

const pop = (i: number) => ({
	initial: { opacity: 0, scale: 0.85, y: 30 },
	animate: { opacity: 1, scale: 1, y: 0 },
	transition: { delay: 0.25 + i * 0.08, type: "spring" as const, stiffness: 120, damping: 16 },
});

const Cell = ({ i, className, children }: { i: number; className: string; children: ReactNode }) => (
	<motion.div {...pop(i)} className={className}>
		{children}
	</motion.div>
);

const Typer = ({ words }: { words: string[] }) => {
	const [i, setI] = useState(0);
	const [n, setN] = useState(0);
	const [del, setDel] = useState(false);
	useEffect(() => {
		const w = words[i];
		const t = window.setTimeout(
			() => {
				if (!del && n < w.length) setN(n + 1);
				else if (!del) setDel(true);
				else if (n > 0) setN(n - 1);
				else {
					setDel(false);
					setI((i + 1) % words.length);
				}
			},
			!del && n === w.length ? 1400 : del ? 35 : 70,
		);
		return () => window.clearTimeout(t);
	}, [n, del, i, words]);
	return (
		<span className='text-[#dc5c48]'>
			{words[i].slice(0, n)}
			<span className='ml-0.5 inline-block w-[3px] animate-pulse bg-[#dc5c48] align-middle' style={{ height: "0.9em" }} />
		</span>
	);
};

const Hero = () => {
	const time = useLocalTime();
	const hour = Number(time.slice(0, 2));
	const synqit = projects[0];
	return (
		<section className='grid auto-rows-[minmax(150px,auto)] grid-cols-1 gap-3 md:grid-cols-12 md:gap-4'>
			<Cell i={0} className='md:col-span-7 md:row-span-2'>
				<Tile className='flex h-full flex-col justify-between p-7 md:p-10'>
					<div className='flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#1d232b]/60'>
						<span className='relative flex h-2 w-2'>
							<span className='lab-pulse absolute inset-0 rounded-full bg-emerald-500' />
							<span className='relative h-2 w-2 rounded-full bg-emerald-500' />
						</span>
						{me.availability}
					</div>
					<div>
						<p className='font-display text-lg font-semibold text-[#1d232b]/60'>Hi, I’m {me.first} 👋</p>
						<h1 className='font-display mt-3 text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] md:text-6xl'>
							Senior frontend engineer crafting products people <span className='bg-gradient-to-r from-[#dc5c48] to-[#488b9b] bg-clip-text text-transparent'>love to use</span>.
						</h1>
						<p className='mt-5 text-lg text-[#1d232b]/70'>
							Also <Typer words={me.alsoIs} />
						</p>
					</div>
					<div className='mt-8 flex flex-wrap gap-3'>
						<a href='#work' className='rounded-full bg-[#1d232b] px-6 py-3 font-semibold text-white transition-transform hover:scale-105'>
							See my work
						</a>
						<Link to='/bento/contact' className='rounded-full border border-[#1d232b]/15 bg-white/70 px-6 py-3 font-semibold transition-colors hover:border-[#dc5c48] hover:text-[#dc5c48]'>
							Get in touch →
						</Link>
					</div>
				</Tile>
			</Cell>

			<Cell i={1} className='md:col-span-5 md:row-span-2'>
				<Tilt className='h-full min-h-[380px] overflow-hidden rounded-[28px]'>
					<img src={me.photo} alt={me.name} className='absolute inset-0 h-full w-full object-cover' />
					<div className='absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl border border-white/40 bg-white/25 p-4 text-white backdrop-blur-md'>
						<div>
							<p className='font-display text-xl font-bold'>{me.name}</p>
							<p className='text-sm text-white/80'>{me.role}</p>
						</div>
						<Logo className='h-12 w-12 text-white' animateOnMount={false} />
					</div>
				</Tilt>
			</Cell>

			<Cell i={2} className='md:col-span-3'>
				<Tile className='flex h-full items-center justify-center p-6' glow='rgba(72,139,155,.25)'>
					<Logo className='h-28 w-28 text-[#dc5c48]' animateOnMount />
				</Tile>
			</Cell>

			<Cell i={3} className='md:col-span-3'>
				<Tile className='flex h-full flex-col justify-between p-6' glow='rgba(72,139,155,.25)'>
					<p className='font-mono text-xs uppercase tracking-[0.14em] text-[#1d232b]/60'>{me.location}</p>
					<div>
						<p className='font-display text-4xl font-extrabold tabular-nums tracking-tight'>{time.slice(0, 5)}</p>
						<p className='text-sm text-[#1d232b]/60'>{hour >= 7 && hour < 20 ? "☀︎ probably coding" : "☾ probably asleep"}</p>
					</div>
				</Tile>
			</Cell>

			<Cell i={4} className='md:col-span-3'>
				<Tile className='flex h-full flex-col justify-between p-6'>
					<p className='font-mono text-xs uppercase tracking-[0.14em] text-[#1d232b]/60'>Kaast in production</p>
					<div>
						<p className='font-display text-5xl font-extrabold tracking-tight text-[#dc5c48]'>
							<Counter to={4000} suffix='+' />
						</p>
						<p className='text-sm text-[#1d232b]/60'>users · 5 companies</p>
					</div>
				</Tile>
			</Cell>

			<Cell i={5} className='md:col-span-3'>
				<Link to='/bento/work/$slug' params={{ slug: synqit.slug }} className='block h-full'>
					<Tile className='h-full p-6'>
						<p className='font-mono text-xs uppercase tracking-[0.14em] text-[#1d232b]/60'>Now building</p>
						<p className='font-display mt-1 text-2xl font-extrabold'>Synqit ↗</p>
						<img
							src={synqit.cover}
							alt=''
							className='absolute -bottom-6 -right-10 w-[85%] rotate-[-8deg] rounded-xl shadow-xl transition-transform duration-500 group-hover:-translate-y-3 group-hover:rotate-[-3deg]'
						/>
					</Tile>
				</Link>
			</Cell>

			<Cell i={6} className='md:col-span-7'>
				<Tile className='flex h-full flex-col justify-center gap-3 py-6'>
					<p className='px-6 font-mono text-xs uppercase tracking-[0.14em] text-[#1d232b]/60'>Daily drivers</p>
					{[false, true].map((rev) => (
						<Marquee key={String(rev)} speed={rev ? 38 : 30} reverse={rev}>
							{(rev ? [...stack].reverse() : stack).map((s) => (
								<span key={s} className='mx-1.5 rounded-full border border-[#1d232b]/10 bg-white/70 px-4 py-2 text-sm font-semibold'>
									{s}
								</span>
							))}
						</Marquee>
					))}
				</Tile>
			</Cell>

			<Cell i={7} className='md:col-span-5'>
				<Link to='/bento/contact' className='group relative flex h-full min-h-[150px] items-end justify-between overflow-hidden rounded-[28px] bg-[#dc5c48] p-7 text-white'>
					<div className='absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 transition-transform duration-700 group-hover:scale-[3]' />
					<p className='font-display relative text-3xl font-extrabold leading-none tracking-tight md:text-4xl'>
						Let’s build <br /> something.
					</p>
					<span className='relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-[#dc5c48] transition-transform duration-500 group-hover:rotate-[-45deg]'>→</span>
				</Link>
			</Cell>
		</section>
	);
};

const Work = () => (
	<section id='work' className='scroll-mt-24 pt-24'>
		<Reveal className='mb-8 flex items-end justify-between px-2'>
			<h2 className='font-display text-4xl font-extrabold tracking-[-0.035em] md:text-6xl'>Selected work</h2>
			<p className='hidden text-[#1d232b]/60 md:block'>Products I founded & products I built for clients.</p>
		</Reveal>
		<div className='grid gap-4 md:grid-cols-6'>
			{projects.map((p, i) => (
				<Reveal key={p.slug} delay={(i % 3) * 0.08} className={i === 0 ? "md:col-span-6" : i < 3 ? "md:col-span-3" : "md:col-span-2"}>
					<Link to='/bento/work/$slug' params={{ slug: p.slug }} className='block'>
						<Tilt max={6} className='overflow-hidden rounded-[28px] border border-white/70 bg-white/55 shadow-[0_20px_60px_-30px_rgba(29,35,43,.35)] backdrop-blur-xl'>
							<div className={`relative overflow-hidden ${i === 0 ? "aspect-[21/9]" : "aspect-[16/10]"}`}>
								{p.cover && <img src={p.cover} alt='' loading='lazy' className='h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105' />}
								<span className='absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] backdrop-blur'>{p.kind}</span>
							</div>
							<div className='flex items-center justify-between gap-4 p-5'>
								<div>
									<h3 className='font-display text-xl font-extrabold tracking-tight md:text-2xl'>{p.name}</h3>
									<p className='text-sm text-[#1d232b]/60'>{p.tagline}</p>
								</div>
								<span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1d232b] text-white transition-all duration-300 group-hover:rotate-[-45deg] group-hover:bg-[#dc5c48]'>→</span>
							</div>
						</Tilt>
					</Link>
				</Reveal>
			))}
		</div>
	</section>
);

const Journey = () => {
	const wrap = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState<number | null>(null);
	return (
		<section className='pt-24'>
			<Reveal className='mb-8 flex items-end justify-between px-2'>
				<h2 className='font-display text-4xl font-extrabold tracking-[-0.035em] md:text-6xl'>The journey</h2>
				<p className='font-mono text-xs uppercase tracking-[0.14em] text-[#1d232b]/60'>← drag →</p>
			</Reveal>
			<div ref={wrap} className='overflow-hidden rounded-[28px]'>
				<motion.div drag='x' dragConstraints={wrap} className='flex w-max cursor-grab gap-4 active:cursor-grabbing'>
					{history.map((h, i) => (
						<motion.div key={h.company + h.title} layout onClick={() => setOpen(open === i ? null : i)} className='w-[300px] md:w-[340px]'>
							<Tile className='h-full p-6'>
								<p className='font-mono text-xs uppercase tracking-[0.14em] text-[#dc5c48]'>{h.period}</p>
								<h3 className='font-display mt-3 text-2xl font-extrabold tracking-tight'>{h.company}</h3>
								<p className='text-[#1d232b]/70'>{h.title}</p>
								<AnimatePresence initial={false}>
									{open === i && (
										<motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className='overflow-hidden text-sm text-[#1d232b]/70'>
											<span className='block pt-3'>{h.body}</span>
										</motion.p>
									)}
								</AnimatePresence>
								<p className='mt-4 text-xs font-semibold text-[#1d232b]/50'>{open === i ? "− less" : "+ more"}</p>
							</Tile>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

const BentoHome = () => (
	<>
		<Hero />
		<Work />
		<Journey />
		<Reveal className='pt-24'>
			<Tile className='px-6 py-16 text-center md:py-24'>
				<motion.p
					className='font-display text-4xl font-extrabold tracking-[-0.04em] md:text-7xl'
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: EASE_OUT }}>
					Have an idea? <span className='text-[#dc5c48]'>Let’s talk.</span>
				</motion.p>
				<Link to='/bento/contact' className='mt-8 inline-block rounded-full bg-[#1d232b] px-8 py-4 font-semibold text-white transition-transform hover:scale-105'>
					Start a conversation
				</Link>
			</Tile>
		</Reveal>
	</>
);

export default BentoHome;
