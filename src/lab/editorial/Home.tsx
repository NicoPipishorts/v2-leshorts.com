import { Link } from "@tanstack/react-router";
import {
	AnimatePresence,
	motion,
	useScroll,
	useSpring,
	useTransform,
	useVelocity,
} from "framer-motion";
import { useRef, useState } from "react";
import Logo from "../../components/Logo";
import { history, me, projects, stats } from "../data";
import { Counter, EASE, EASE_OUT, Marquee, Reveal, SplitText, useMouse } from "../shared";

const SpinningBadge = ({ text, className = "" }: { text: string; className?: string }) => (
	<div className={`relative aspect-square ${className}`}>
		<svg viewBox='0 0 200 200' className='lab-spin absolute inset-0 h-full w-full'>
			<defs>
				<path id='circle' d='M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0' />
			</defs>
			<text className='fill-current text-[14px] uppercase tracking-[0.2em]' style={{ fontFamily: "JetBrains Mono, monospace" }}>
				<textPath href='#circle'>{text}</textPath>
			</text>
		</svg>
		<Logo className='absolute inset-[28%] text-[#dc5c48]' animateOnMount />
	</div>
);

const Hero = () => {
	const ref = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
	const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
	const nameX = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
	const lastX = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

	return (
		<section ref={ref} className='relative overflow-hidden px-4 pb-16 pt-28 md:px-8 md:pt-32'>
			{/* hairline grid drawing in */}
			<div className='pointer-events-none absolute inset-0 grid grid-cols-4 px-4 md:grid-cols-12 md:px-8'>
				{Array.from({ length: 12 }).map((_, i) => (
					<motion.div
						key={i}
						className={`border-l border-[#1d232b]/[0.07] ${i >= 4 ? "hidden md:block" : ""}`}
						style={{ originY: 0 }}
						initial={{ scaleY: 0 }}
						animate={{ scaleY: 1 }}
						transition={{ duration: 1.4, ease: EASE, delay: 0.4 + i * 0.05 }}
					/>
				))}
			</div>

			<div className='relative grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.14em] md:grid-cols-4'>
				{["Portfolio — 2026 edition", me.role, "Based in Isère, FR", "Open to new roles"].map((t, i) => (
					<motion.span key={t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.08 }} className={i > 1 ? "hidden md:block" : ""}>
						{t}
					</motion.span>
				))}
			</div>

			<h1 className='font-display relative mt-8 font-extrabold uppercase leading-[0.8] tracking-[-0.06em]'>
				<motion.span className='block whitespace-nowrap text-[18vw]' style={{ x: nameX }}>
					<SplitText text='Nicolas' delay={0.8} stagger={0.05} />
				</motion.span>
				<motion.span className='flex items-end justify-end gap-[2vw] whitespace-nowrap text-[18vw]' style={{ x: lastX }}>
					<motion.span
						className='group relative mb-[2vw] hidden h-[15vw] w-[26vw] overflow-hidden rounded-full bg-[#488b9b] md:block'
						initial={{ scaleX: 0 }}
						animate={{ scaleX: 1 }}
						transition={{ delay: 1.3, duration: 1, ease: EASE }}>
						<motion.img
							src={me.cutout}
							alt=''
							style={{ y: photoY }}
							className='absolute left-1/2 top-[8%] w-[80%] -translate-x-1/2 grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0'
						/>
					</motion.span>
					<SplitText text='Pisar' delay={1.0} stagger={0.05} />
				</motion.span>
			</h1>

			<div className='relative mt-10 grid items-end gap-10 md:grid-cols-12'>
				<motion.p
					className='font-serif text-4xl leading-[1.05] md:col-span-7 md:text-6xl'
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.5, duration: 1, ease: EASE_OUT }}>
					Frontend engineer building interfaces with <em className='font-serif-i text-[#dc5c48]'>taste</em>,{" "}
					<em className='font-serif-i text-[#488b9b]'>tempo</em> & TypeScript.
				</motion.p>
				<motion.div className='md:col-span-3 md:col-start-10' initial={{ opacity: 0, scale: 0.5, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 1.7, type: "spring", stiffness: 70, damping: 14 }}>
					<SpinningBadge text='Available now ✺ Remote or hybrid ✺ ' className='mx-auto w-40 md:w-48' />
				</motion.div>
			</div>
		</section>
	);
};

const CrossBands = () => (
	<section className='relative h-[34vw] min-h-[220px] overflow-hidden md:h-[22vw]'>
		<div className='absolute left-[-5%] top-1/2 w-[110%] -translate-y-1/2 -rotate-[4deg] bg-[#488b9b] py-4 text-[#efe9df]'>
			<Marquee speed={35} reverse>
				{me.alsoIs.concat(me.alsoIs).map((s, i) => (
					<span key={i} className='font-serif-i px-6 text-4xl md:text-6xl'>
						also {s} <span className='not-italic'>✺</span>
					</span>
				))}
			</Marquee>
		</div>
		<div className='absolute left-[-5%] top-1/2 w-[110%] -translate-y-1/2 rotate-[3deg] bg-[#dc5c48] py-4 text-[#1d232b] shadow-[0_20px_40px_-20px_rgba(0,0,0,.4)]'>
			<Marquee speed={28}>
				{["React", "TypeScript", "Product engineering", "Design systems", "React Native", "Node.js", "Accessibility"].map((s) => (
					<span key={s} className='font-display px-6 text-4xl font-extrabold uppercase tracking-tight md:text-6xl'>
						{s} ✺
					</span>
				))}
			</Marquee>
		</div>
	</section>
);

const Intro = () => (
	<section className='grid gap-8 px-4 py-28 md:grid-cols-12 md:px-8 md:py-40'>
		<p className='text-xs uppercase tracking-[0.14em] md:col-span-3'>(Hello)</p>
		<Reveal className='md:col-span-9'>
			<p className='font-serif text-4xl leading-[1.1] md:text-7xl'>
				I’m Nicolas{" "}
				<img src={me.photo} alt='' className='inline-block h-[0.85em] w-[1.6em] rounded-full object-cover align-baseline' /> — I’ve been writing code since 2001 and
				shipping products for over a decade. I co-founded <em className='font-serif-i text-[#dc5c48]'>Kaast</em>, I’m building{" "}
				<em className='font-serif-i text-[#488b9b]'>Synqit</em>, and I run a small studio{" "}
				<Logo className='inline-block h-[0.8em] w-[0.8em] align-baseline text-[#dc5c48]' animateOnMount={false} /> for clients who care about the last ten percent.
			</p>
		</Reveal>
	</section>
);

const Index = () => {
	const { x, y } = useMouse();
	const sx = useSpring(x, { stiffness: 180, damping: 22 });
	const sy = useSpring(y, { stiffness: 180, damping: 22 });
	const vx = useVelocity(sx);
	const rotate = useTransform(vx, [-2000, 2000], [-12, 12]);
	const [hover, setHover] = useState<number | null>(null);

	return (
		<section id='work' className='px-4 pb-32 md:px-8'>
			<div className='mb-10 flex items-end justify-between border-b border-[#1d232b] pb-4'>
				<h2 className='font-display text-5xl font-extrabold uppercase tracking-[-0.05em] md:text-8xl'>Index</h2>
				<p className='font-serif-i text-2xl'>{projects.length} selected projects</p>
			</div>

			<motion.div
				className='pointer-events-none fixed left-0 top-0 z-40 hidden w-[360px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl shadow-2xl md:block'
				style={{ x: sx, y: sy, rotate }}
				animate={{ opacity: hover === null ? 0 : 1, scale: hover === null ? 0.6 : 1 }}
				transition={{ duration: 0.3 }}>
				<AnimatePresence mode='popLayout'>
					{hover !== null && projects[hover].cover && (
						<motion.img
							key={hover}
							src={projects[hover].cover}
							alt=''
							className='aspect-[4/3] w-full object-cover object-top'
							initial={{ clipPath: "inset(100% 0 0 0)" }}
							animate={{ clipPath: "inset(0% 0 0 0)" }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.45, ease: EASE }}
						/>
					)}
				</AnimatePresence>
			</motion.div>

			<ul onMouseLeave={() => setHover(null)}>
				{projects.map((p, i) => (
					<motion.li
						key={p.slug}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-5%" }}
						transition={{ duration: 0.7, ease: EASE_OUT, delay: (i % 4) * 0.05 }}
						onMouseEnter={() => setHover(i)}>
						<Link to='/editorial/work/$slug' params={{ slug: p.slug }} className='group relative grid grid-cols-12 items-baseline gap-2 overflow-hidden border-b border-[#1d232b]/20 py-5 md:py-7'>
							<span className='absolute inset-0 origin-bottom scale-y-0 bg-[#1d232b] transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-y-100' />
							<span className='relative col-span-1 text-xs transition-colors group-hover:text-[#efe9df]'>{String(i + 1).padStart(2, "0")}</span>
							<span className='font-display relative col-span-11 text-4xl font-extrabold uppercase tracking-[-0.04em] transition-all duration-500 group-hover:translate-x-4 group-hover:text-[#efe9df] md:col-span-6 md:text-7xl'>
								{p.name}
							</span>
							<span className='font-serif-i relative col-span-7 col-start-2 text-xl transition-colors group-hover:text-[#dc5c48] md:col-span-3 md:col-start-auto'>{p.role}</span>
							<span className='relative col-span-4 text-right text-sm transition-colors group-hover:text-[#efe9df] md:col-span-2'>{p.period}</span>
						</Link>
					</motion.li>
				))}
			</ul>
		</section>
	);
};

const Numbers = () => (
	<section className='grid grid-cols-2 gap-px bg-[#1d232b]/15 md:grid-cols-4'>
		{stats.map((s) => (
			<div key={s.label} className='bg-[#efe9df] p-6 md:p-10'>
				<p className='font-serif-i text-7xl leading-none text-[#dc5c48] md:text-9xl'>
					<Counter to={s.value} suffix={s.suffix} />
				</p>
				<p className='mt-4 max-w-[14ch] text-sm uppercase tracking-[0.12em]'>{s.label}</p>
			</div>
		))}
	</section>
);

const Career = () => (
	<section className='grid gap-8 px-4 py-32 md:grid-cols-12 md:px-8'>
		<div className='md:col-span-4'>
			<p className='text-xs uppercase tracking-[0.14em]'>(Career, abridged)</p>
			<h2 className='font-serif mt-4 text-5xl leading-none md:text-7xl'>
				Twenty-five years <em className='font-serif-i text-[#dc5c48]'>of curiosity</em>, ten of them professional.
			</h2>
			<Link to='/editorial/about' className='mt-8 inline-block border-b border-current pb-1 text-sm uppercase tracking-[0.14em] hover:text-[#dc5c48]'>
				Read the long version →
			</Link>
		</div>
		<ul className='md:col-span-7 md:col-start-6'>
			{history.map((h, i) => (
				<Reveal key={h.company + h.title} delay={i * 0.05}>
					<li className='grid grid-cols-12 gap-2 border-t border-[#1d232b]/20 py-5'>
						<span className='col-span-12 text-sm opacity-60 md:col-span-3'>{h.period}</span>
						<span className='font-display col-span-7 text-2xl font-bold tracking-tight md:col-span-4'>{h.company}</span>
						<span className='font-serif-i col-span-5 text-right text-xl md:text-left'>{h.title}</span>
					</li>
				</Reveal>
			))}
		</ul>
	</section>
);

const Cta = () => (
	<section className='px-4 pb-24 md:px-8'>
		<Link to='/editorial/contact' className='group block rounded-[2rem] bg-[#1d232b] px-6 py-16 text-[#efe9df] md:px-12 md:py-24'>
			<p className='text-xs uppercase tracking-[0.14em] opacity-60'>(Next)</p>
			<p className='font-display mt-6 text-[12vw] font-extrabold uppercase leading-[0.85] tracking-[-0.06em] md:text-[9vw]'>
				Let’s make <br />
				<span className='font-serif-i normal-case tracking-normal text-[#dc5c48] transition-colors group-hover:text-[#488b9b]'>something good.</span>
			</p>
			<motion.span className='mt-10 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#dc5c48] text-3xl text-[#1d232b] transition-transform duration-500 group-hover:rotate-[-45deg] group-hover:scale-125'>
				→
			</motion.span>
		</Link>
	</section>
);

const EditorialHome = () => (
	<>
		<Hero />
		<CrossBands />
		<Intro />
		<Index />
		<Numbers />
		<Career />
		<Cta />
	</>
);

export default EditorialHome;
