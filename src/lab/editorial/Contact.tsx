import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type FormEvent } from "react";
import { email, mailto, me } from "../data";
import { EASE, useLocalTime } from "../shared";

/** Inline input that grows with its content, underlined like a blank on a form letter. */
const Blank = ({ name, placeholder, type = "text" }: { name: string; placeholder: string; type?: string }) => {
	const [v, setV] = useState("");
	return (
		<span className='relative inline-grid align-baseline'>
			<span className='invisible col-start-1 row-start-1 whitespace-pre px-1'>{v || placeholder}</span>
			<input
				name={name}
				type={type}
				required
				value={v}
				onChange={(e) => setV(e.target.value)}
				placeholder={placeholder}
				className='font-serif-i peer col-start-1 row-start-1 w-full min-w-[4ch] px-1 text-[#dc5c48] outline-none placeholder:text-[#1d232b]/25'
			/>
			<span className='absolute bottom-1 left-0 h-[2px] w-full bg-[#1d232b]/25' />
			<span className='absolute bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#dc5c48] transition-transform duration-500 peer-focus:scale-x-100' />
		</span>
	);
};

const TOPICS = ["a senior frontend role", "a freelance project", "a coffee & a chat"];

const Plane = () => (
	<motion.svg
		viewBox='0 0 64 64'
		className='pointer-events-none fixed left-1/2 top-1/2 z-[70] h-24 w-24 text-[#dc5c48]'
		initial={{ x: "-50%", y: "-50%", scale: 0.2, rotate: 0, opacity: 0 }}
		animate={{
			x: ["-50%", "-120%", "10vw", "70vw"],
			y: ["-50%", "10vh", "-20vh", "-80vh"],
			scale: [0.2, 1.2, 1, 0.4],
			rotate: [0, -30, 20, 35],
			opacity: [0, 1, 1, 0],
		}}
		transition={{ duration: 1.8, ease: "easeInOut", times: [0, 0.3, 0.6, 1] }}>
		<path d='M4 30 L60 6 L42 58 L30 38 Z' fill='currentColor' />
		<path d='M30 38 L60 6 L24 34 Z' fill='#1d232b' opacity='.35' />
	</motion.svg>
);

const EditorialContact = () => {
	const time = useLocalTime();
	const [topic, setTopic] = useState(0);
	const [sent, setSent] = useState(false);
	const [copied, setCopied] = useState(false);
	const constraints = useRef<HTMLDivElement>(null);

	const submit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const f = new FormData(e.currentTarget);
		setSent(true);
		const body = `Hello Nicolas,\n\nMy name is ${f.get("name")} from ${f.get("company")}. I'd love to talk about ${TOPICS[topic]}.\n\n${f.get("message")}\n\nYou can reach me at ${f.get("email")}.`;
		// ponytail: mailto hand-off, swap for an API route (Resend) if you want in-page sending
		window.setTimeout(() => (window.location.href = mailto(`Hello from ${f.get("name")}`, body)), 1600);
	};

	return (
		<section className='px-4 pb-28 pt-28 md:px-8 md:pt-32'>
			<div ref={constraints} className='relative -mx-4 overflow-hidden px-4 md:-mx-8 md:px-8'>
				<p className='text-xs uppercase tracking-[0.14em]'>(Contact) — the letters are loose, move them around</p>
				<h1 className='font-display select-none py-4 text-[22vw] font-extrabold uppercase leading-[0.8] tracking-[-0.06em] md:text-[17vw]'>
					{[..."Hello"].map((c, i) => (
						<motion.span
							key={i}
							drag
							dragConstraints={constraints}
							dragElastic={0.4}
							whileDrag={{ scale: 1.1, color: "#dc5c48" }}
							whileHover={{ y: -12, rotate: i % 2 ? 4 : -4 }}
							initial={{ y: "100%", opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.6 + i * 0.07, type: "spring", stiffness: 200, damping: 16 }}
							className='inline-block cursor-grab active:cursor-grabbing'>
							{c}
						</motion.span>
					))}
					<span className='font-serif-i normal-case tracking-normal text-[#dc5c48]'>!</span>
				</h1>
			</div>

			<div className='mt-12 grid gap-16 md:grid-cols-12'>
				<AnimatePresence mode='wait'>
					{!sent ? (
						<motion.form
							key='letter'
							onSubmit={submit}
							className='relative rounded-[2rem] bg-[#f7f3ec] p-6 shadow-[0_30px_80px_-40px_rgba(29,35,43,.5)] md:col-span-8 md:p-12'
							exit={{ scale: 0.3, rotate: -18, y: -80, opacity: 0, transition: { duration: 0.6, ease: EASE } }}>
							<div className='mb-8 flex items-center justify-between text-xs uppercase tracking-[0.14em] opacity-60'>
								<span>To: Nicolas Pisar</span>
								<span>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
							</div>
							<div className='font-serif text-3xl leading-[1.6] md:text-[2.6rem]'>
								Hello Nicolas, my name is <Blank name='name' placeholder='your name' /> from <Blank name='company' placeholder='company' />. I’d love to talk about{" "}
								<button
									type='button'
									onClick={() => setTopic((t) => (t + 1) % TOPICS.length)}
									className='font-serif-i relative inline-block text-[#488b9b] underline decoration-dotted decoration-2 underline-offset-8'>
									<AnimatePresence mode='wait'>
										<motion.span key={topic} className='inline-block' initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
											{TOPICS[topic]}
										</motion.span>
									</AnimatePresence>
									<span className='ml-1 text-base not-italic'>↻</span>
								</button>
								. You can reach me at <Blank name='email' type='email' placeholder='you@email.com' />.
								<textarea
									name='message'
									rows={3}
									placeholder='P.S. a few words about the project…'
									className='font-serif-i mt-6 block w-full resize-none border-b-2 border-[#1d232b]/25 text-2xl outline-none transition-colors placeholder:text-[#1d232b]/25 focus:border-[#dc5c48] md:text-3xl'
								/>
							</div>
							<div className='mt-10 flex flex-wrap items-center justify-between gap-6'>
								<p className='font-serif-i text-2xl'>— warmly, you.</p>
								<motion.button
									type='submit'
									whileHover={{ scale: 1.05, rotate: -2 }}
									whileTap={{ scale: 0.95 }}
									className='rounded-full bg-[#1d232b] px-8 py-4 text-sm uppercase tracking-[0.14em] text-[#efe9df] hover:bg-[#dc5c48]'>
									Fold & send ✈
								</motion.button>
							</div>
						</motion.form>
					) : (
						<motion.div key='sent' className='flex min-h-[420px] flex-col justify-center md:col-span-8' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
							<Plane />
							<p className='font-serif-i text-6xl leading-none text-[#dc5c48] md:text-8xl'>It’s on its way.</p>
							<p className='mt-6 text-lg opacity-70'>Your mail app should open with the letter ready. Talk soon!</p>
						</motion.div>
					)}
				</AnimatePresence>

				<aside className='space-y-10 md:col-span-3 md:col-start-10'>
					<div>
						<p className='text-xs uppercase tracking-[0.14em] opacity-60'>Direct line</p>
						<button
							onClick={async () => {
								await navigator.clipboard.writeText(email());
								setCopied(true);
								window.setTimeout(() => setCopied(false), 1800);
							}}
							className='font-serif-i mt-2 text-left text-3xl hover:text-[#dc5c48]'>
							{email()}
						</button>
						<AnimatePresence>
							{copied && (
								<motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className='text-sm text-[#488b9b]'>
									Copied to clipboard ✓
								</motion.p>
							)}
						</AnimatePresence>
					</div>
					<ul className='border-t border-[#1d232b]'>
						{Object.entries(me.links).map(([k, v]) => (
							<li key={k}>
								<a href={v} target='_blank' rel='noreferrer' className='group flex justify-between border-b border-[#1d232b]/20 py-3 capitalize'>
									<span className='transition-transform group-hover:translate-x-2'>{k}</span>
									<span className='transition-colors group-hover:text-[#dc5c48]'>↗</span>
								</a>
							</li>
						))}
					</ul>
					<p className='text-sm opacity-70'>
						{me.location} — it’s {time} here.
						<br />I usually answer within a day.
					</p>
				</aside>
			</div>
		</section>
	);
};

export default EditorialContact;
