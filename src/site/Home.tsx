import { Link } from "@tanstack/react-router";
import {
	AnimatePresence,
	motion,
	useScroll,
	useTransform,
	type MotionValue,
} from "framer-motion";
import { useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { IgniteTheme, PARTICLES } from "./Layout";
import Logo from "../components/Logo";
import { stack, useContent, type Project } from "./data";
import {
	Counter,
	EASE_OUT,
	HEX_CLIP,
	fitVw,
	Magnetic,
	Marquee,
	ParticleLogo,
	Reveal,
	SplitText,
	useLocalTime,
} from "./shared";

const RotatingWord = ({ words }: { words: string[] }) => {
	const [i, setI] = useState(0);
	useEffect(() => {
		const id = window.setInterval(() => setI((n) => (n + 1) % words.length), 2200);
		return () => window.clearInterval(id);
	}, [words.length]);
	return (
		// exactly one line box tall and top-aligned, so the word sits on the sentence's baseline
		<span className='relative inline-block h-[1lh] overflow-hidden align-top'>
			<AnimatePresence mode='popLayout' initial={false}>
				<motion.span
					key={words[i]}
					className='block text-[#dc5c48]'
					initial={{ y: "100%", opacity: 0 }}
					animate={{ y: "0%", opacity: 1 }}
					exit={{ y: "-100%", opacity: 0 }}
					transition={{ duration: 0.5, ease: EASE_OUT }}>
					{words[i]}
				</motion.span>
			</AnimatePresence>
		</span>
	);
};

const Hero = () => {
	const ref = useRef<HTMLElement>(null);
	const time = useLocalTime();
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
	const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
	const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
	const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
	const { me, ui } = useContent();
	const palette = PARTICLES[useContext(IgniteTheme)];

	return (
		<section ref={ref} className='relative flex h-[100svh] min-h-[640px] flex-col justify-end overflow-hidden px-4 pb-10 md:flex-row md:items-end md:justify-start md:px-8 md:pb-14'>
			<div className='pointer-events-none absolute -left-40 top-1/3 h-[60vmax] w-[60vmax] rounded-full bg-[#dc5c48]/15 blur-[120px]' />
			<div className='pointer-events-none absolute -right-40 -top-40 h-[50vmax] w-[50vmax] rounded-full bg-[#488b9b]/15 blur-[120px]' />

			{/* phones: the logo takes the free space between the header and the name, fully visible; md+: unchanged (behind, right) */}
			<motion.div className='relative -mx-4 mb-6 mt-20 min-h-0 flex-1 md:absolute md:inset-0 md:left-[38%] md:m-0' style={{ scale: logoScale, opacity: fade }} data-hot>
				<ParticleLogo colors={palette.colors} hexColor={palette.hex} dot={palette.dot} />
			</motion.div>

			<motion.div className='pointer-events-none relative z-10 w-full' style={{ y, opacity: fade }}>
				<motion.p
					className='mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-ig-fg/70'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2 }}>
					<span className='relative flex h-2 w-2'>
						<span className='fx-pulse absolute inset-0 rounded-full bg-[#5fd38d]' />
						<span className='relative h-2 w-2 rounded-full bg-[#5fd38d]' />
					</span>
					{me.availability}
				</motion.p>
				<h1 className='font-unbounded text-[14.5vw] font-black uppercase leading-[0.82] md:text-[11.5vw]'>
					<SplitText text={me.first} delay={0.9} />
					<br />
					<span className='inline-flex items-center gap-[0.12em] text-ig-sand'>
						<SplitText text={me.last} delay={1.15} />
						<motion.span
							className='pointer-events-auto relative inline-block h-[0.8em] w-[0.8em] shrink-0'
							initial={{ scale: 0, rotate: -120 }}
							animate={{ scale: 1, rotate: 0 }}
							whileHover={{ scale: 1.08, rotate: 6 }}
							transition={{ delay: 1.5, type: "spring", stiffness: 90, damping: 13 }}>
							<span className='absolute inset-[-7%] rotate-12 bg-[#dc5c48]' style={{ clipPath: HEX_CLIP }} />
							<img src={me.photo} alt={me.name} className='absolute inset-0 h-full w-full object-cover' style={{ clipPath: HEX_CLIP }} />
						</motion.span>
					</span>
				</h1>
				<motion.div
					className='mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.6, duration: 0.8, ease: EASE_OUT }}>
					<p className='text-lg leading-snug text-ig-fg/80 md:text-2xl'>
						{me.role} —
						<br />
						<span className='whitespace-nowrap'>
							{ui.andAlso} <RotatingWord words={me.alsoIs} />
						</span>
					</p>
					<div className='pointer-events-auto flex items-center gap-6 font-mono text-xs uppercase tracking-[0.18em] text-ig-fg/50'>
						<span>La Bâtie-Montgascon, Isère · {time}</span>
					</div>
				</motion.div>
			</motion.div>
		</section>
	);
};

const Word = ({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) => {
	const opacity = useTransform(progress, range, [0.12, 1]);
	return (
		<motion.span style={{ opacity }} className='mr-[0.25em] inline-block'>
			{word}
		</motion.span>
	);
};

const Statement = () => {
	const ref = useRef<HTMLParagraphElement>(null);
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
	const { ui } = useContent();
	const words = ui.statement.split(" ");
	return (
		<section className='px-4 py-32 md:px-8 md:py-48'>
			<p className='mb-10 font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48]'>{ui.shortVersion}</p>
			<p ref={ref} className='font-unbounded max-w-6xl text-3xl font-semibold leading-[1.15] md:text-6xl'>
				{words.map((w, i) => (
					<Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
				))}
			</p>
		</section>
	);
};

const WorkCard = ({ p, kind }: { p: Project; kind: string }) => (
	<Link
		to='/work/$slug'
		params={{ slug: p.slug }}
		className='group relative block h-[62vh] w-[85vw] shrink-0 overflow-hidden rounded-3xl border border-ig-fg/10 bg-ig-panel md:h-[70vh] md:w-[62vw]'>
		{p.cover && (
			<img
				src={p.cover}
				alt=''
				className='absolute inset-0 h-full w-full object-cover object-top opacity-70 transition-all duration-[1.2s] ease-out group-hover:scale-105 group-hover:opacity-90'
			/>
		)}
		<div className='absolute inset-0 bg-gradient-to-t from-ig-bg via-ig-bg/40 to-transparent' />
		<div className='absolute left-0 top-0 flex w-full justify-between p-6 font-mono text-xs uppercase tracking-[0.18em] text-ig-fg/70'>
			<span>{kind}</span>
			<span>{p.period}</span>
		</div>
		<div className='absolute bottom-0 left-0 w-full p-6 md:p-10'>
			<h3 className='font-unbounded text-[min(2.25rem,var(--fit))] font-black uppercase md:text-7xl' style={{ "--fit": `${fitVw(p.name, 68)}vw` } as CSSProperties}>
				{p.name}
			</h3>
			<div className='mt-3 flex items-end justify-between gap-6'>
				<p className='max-w-lg text-ig-fg/75 md:text-lg'>{p.tagline}</p>
				<span className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#dc5c48] text-2xl transition-transform duration-500 group-hover:rotate-[-45deg] md:h-20 md:w-20'>→</span>
			</div>
		</div>
	</Link>
);

const Work = () => {
	const ref = useRef<HTMLElement>(null);
	const track = useRef<HTMLDivElement>(null);
	const [dist, setDist] = useState(0);
	const [desktop, setDesktop] = useState(true);
	const { projects, ui, fmt } = useContent();
	const featured = projects.slice(0, 6);
	useLayoutEffect(() => {
		const measure = () => {
			setDesktop(window.matchMedia("(min-width: 768px)").matches);
			if (track.current) setDist(track.current.scrollWidth - window.innerWidth);
		};
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, []);
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
	const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
	const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

	const header = (
		<div className='flex items-end justify-between px-4 pb-8 md:px-8'>
			<h2 className='font-unbounded text-[min(8.5vw,3rem)] font-black uppercase md:text-8xl'>
				{ui.selected}<span className='text-[#dc5c48]'>*</span> {ui.work}
			</h2>
		</div>
	);

	if (!desktop)
		return (
			<section id='work' className='py-20'>
				{header}
				<div className='flex flex-col items-center gap-6'>
					{featured.map((p) => (
						<Reveal key={p.slug}>
							<WorkCard p={p} kind={ui.kinds[p.kind]} />
						</Reveal>
					))}
				</div>
			</section>
		);

	return (
		<section id='work' ref={ref} style={{ height: `${featured.length * 70}vh` }} className='relative'>
			<div className='sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16'>
				{header}
				<motion.div ref={track} style={{ x }} className='flex gap-8 px-8'>
					{featured.map((p) => (
						<WorkCard key={p.slug} p={p} kind={ui.kinds[p.kind]} />
					))}
					<Link
						to='/about'
						className='flex h-[70vh] w-[30vw] shrink-0 items-center justify-center rounded-3xl border border-dashed border-ig-fg/20 font-unbounded text-3xl font-black uppercase text-ig-fg/60 transition-colors hover:border-[#dc5c48] hover:text-[#dc5c48]'>
						{fmt(ui.more, projects.length - featured.length)}
					</Link>
				</motion.div>
				<div className='mx-8 mt-8 h-px bg-ig-fg/10'>
					<motion.div className='h-px bg-[#dc5c48]' style={{ width: bar }} />
				</div>
			</div>
		</section>
	);
};

const Stats = () => (
	<section className='grid grid-cols-2 border-y border-ig-fg/10 md:grid-cols-4'>
		{useContent().stats.map((s, i) => (
			<Reveal key={s.label} delay={i * 0.1} className='border-ig-fg/10 p-6 md:p-10 [&:not(:last-child)]:border-r'>
				<div className='font-unbounded text-[min(8.5vw,3rem)] font-black text-[#dc5c48] md:text-7xl'>
					<Counter to={s.value} suffix={s.suffix} />
				</div>
				<p className='mt-3 font-mono text-xs uppercase tracking-[0.16em] text-ig-fg/60'>{s.label}</p>
			</Reveal>
		))}
	</section>
);

const Journey = () => {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.5"] });
	const { history, ui } = useContent();
	return (
		<section className='px-4 py-32 md:px-8'>
			<div className='mb-16 flex items-end justify-between'>
				<h2 className='font-unbounded text-[min(8.5vw,3rem)] font-black uppercase md:text-8xl'>{ui.journey}</h2>
				<Link to='/about' className='font-mono text-xs uppercase tracking-[0.2em] text-[#dc5c48] hover:underline'>
					{ui.fullStory}
				</Link>
			</div>
			<div ref={ref} className='relative ml-2 md:ml-[20%]'>
				<div className='absolute left-0 top-0 h-full w-px bg-ig-fg/10' />
				<motion.div className='absolute left-0 top-0 w-px origin-top bg-[#dc5c48] shadow-[0_0_20px_#dc5c48]' style={{ height: "100%", scaleY: scrollYProgress }} />
				{history.slice(0, 4).map((h, i) => (
					<Reveal key={h.company} delay={i * 0.05} className='relative pb-16 pl-10 md:pl-16'>
						<span className='absolute -left-[5px] top-3 h-[11px] w-[11px] rounded-full border-2 border-[#dc5c48] bg-ig-bg' />
						<p className='font-mono text-xs uppercase tracking-[0.2em] text-ig-fg/50'>{h.period}</p>
						<h3 className='font-unbounded mt-2 text-3xl font-black uppercase md:text-[min(8.5vw,3rem)]'>{h.company}</h3>
						<p className='mt-1 text-[#dc5c48]'>{h.title}</p>
						<p className='mt-3 max-w-xl text-ig-fg/65'>{h.body}</p>
					</Reveal>
				))}
			</div>
		</section>
	);
};

const Stack = () => (
	<section className='overflow-hidden border-y border-ig-fg/10 py-6'>
		<Marquee speed={40}>
			{stack.map((s) => (
				<span key={s} className='font-unbounded flex items-center gap-8 px-4 text-4xl font-black uppercase text-ig-fg/25 md:text-6xl'>
					{s} <Logo className='fx-spin h-[0.8em] w-[0.8em] text-[#dc5c48] [animation-duration:8s]' animateOnMount={false} />
				</span>
			))}
		</Marquee>
	</section>
);

const Cta = () => {
	const { ui } = useContent();
	return (
	<section className='relative flex flex-col items-center px-4 py-40 text-center md:py-56'>
		<div className='pointer-events-none absolute left-1/2 top-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dc5c48]/20 blur-[140px]' />
		<p className='relative font-mono text-xs uppercase tracking-[0.2em] text-ig-fg/50'>{ui.nextStep}</p>
		<h2 className='font-unbounded relative mt-6 text-[min(8.5vw,3rem)] font-black uppercase leading-[0.9] md:text-9xl'>
			<SplitText key={ui.ctaLine1} text={ui.ctaLine1} inView by='word' />
			<br />
			<span className='text-[#dc5c48]'>
				<SplitText key={ui.ctaLine2} text={ui.ctaLine2} inView delay={0.2} />
			</span>
		</h2>
		<Magnetic className='relative mt-16'>
			<Link
				to='/contact'
				className='flex h-40 w-40 items-center justify-center rounded-full bg-[#dc5c48] font-mono text-sm uppercase tracking-[0.18em] text-[#0b0c0f] transition-transform duration-300 hover:scale-110 md:h-52 md:w-52'>
				{ui.letsTalk}
			</Link>
		</Magnetic>
	</section>
	);
};

const IgniteHome = () => (
	<>
		<Hero />
		<Stack />
		<Statement />
		<Work />
		<Stats />
		<Journey />
		<Cta />
	</>
);

export default IgniteHome;
