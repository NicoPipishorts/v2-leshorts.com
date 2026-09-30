import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { FiMail, FiSend } from "react-icons/fi";
import { SiGithub, SiInstagram, SiLinkedin } from "react-icons/si";
import Logo from "../../components/Logo";
import { email, mailto, me } from "../data";
import { useLocalTime } from "../shared";
import { Tile } from "./Layout";

type Step = { key: "name" | "topic" | "message" | "email"; ask: (a: Answers) => string; chips?: string[]; type?: string; placeholder: string };
type Answers = Partial<Record<Step["key"], string>>;

const STEPS: Step[] = [
	{ key: "name", ask: () => "Hey 👋 I’m Nicolas. What’s your name?", placeholder: "Your name" },
	{ key: "topic", ask: (a) => `Nice to meet you, ${a.name}! What brings you here?`, chips: ["Full-time role", "Freelance project", "Just saying hi"], placeholder: "Or type something…" },
	{ key: "message", ask: () => "Love it. Tell me a bit more — what are you working on?", placeholder: "A few words…" },
	{ key: "email", ask: () => "Last one: where can I reach you?", type: "email", placeholder: "you@company.com" },
];

const Typing = () => (
	<div className='flex gap-1 px-1 py-2'>
		{[0, 1, 2].map((i) => (
			<motion.span key={i} className='h-2 w-2 rounded-full bg-[#1d232b]/40' animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
		))}
	</div>
);

const Bubble = ({ from, children }: { from: "me" | "you"; children: ReactNode }) => (
	<motion.div
		layout
		initial={{ opacity: 0, y: 16, scale: 0.9 }}
		animate={{ opacity: 1, y: 0, scale: 1 }}
		transition={{ type: "spring", stiffness: 300, damping: 24 }}
		className={`flex items-end gap-2 ${from === "you" ? "justify-end" : ""}`}
		style={{ originX: from === "you" ? 1 : 0 }}>
		{from === "me" && <img src={me.photo} alt='' className='h-8 w-8 rounded-full object-cover' />}
		<div className={`max-w-[80%] rounded-3xl px-4 py-3 ${from === "me" ? "rounded-bl-md bg-white text-[#1d232b] shadow-sm" : "rounded-br-md bg-[#1d232b] text-white"}`}>{children}</div>
	</motion.div>
);

const Confetti = () => {
	// random once, so the per-second clock re-render doesn't re-fire the burst
	const [bits] = useState(() => Array.from({ length: 36 }, () => ({ d: 160 + Math.random() * 180, r: Math.random() * 720 })));
	return (
	<div className='pointer-events-none absolute inset-0 overflow-visible'>
		{bits.map(({ d, r }, i) => {
			const a = (i / 36) * Math.PI * 2;
			return (
				<motion.span
					key={i}
					className='absolute left-1/2 top-1/2 h-3 w-2 rounded-sm'
					style={{ background: ["#dc5c48", "#488b9b", "#b79a77", "#1d232b"][i % 4] }}
					initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
					animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d + 120, rotate: r, opacity: 0 }}
					transition={{ duration: 1.4, ease: [0.2, 0.8, 0.4, 1] }}
				/>
			);
		})}
	</div>
	);
};

const ORBIT = [
	{ Icon: SiGithub, href: me.links.github, label: "GitHub" },
	{ Icon: SiLinkedin, href: me.links.linkedin, label: "LinkedIn" },
	{ Icon: SiInstagram, href: me.links.instagram, label: "Instagram" },
	{ Icon: FiMail, href: `mailto:${email()}`, label: "Email" },
];

const Orbit = () => (
	<div className='relative mx-auto aspect-square w-full max-w-[340px]'>
		<div className='absolute inset-[22%] overflow-hidden rounded-full border-4 border-white shadow-xl'>
			<img src={me.photo} alt={me.name} className='h-full w-full object-cover' />
		</div>
		<div className='absolute inset-[6%] rounded-full border border-dashed border-[#1d232b]/20' />
		<motion.div className='absolute inset-[6%]' animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 24, ease: "linear" }}>
			{ORBIT.map(({ Icon, href, label }, i) => {
				const a = (i / ORBIT.length) * Math.PI * 2;
				return (
					<motion.a
						key={label}
						href={href}
						target={href.startsWith("http") ? "_blank" : undefined}
						rel='noreferrer'
						aria-label={label}
						className='absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl shadow-lg transition-colors hover:bg-[#dc5c48] hover:text-white'
						style={{ left: `${50 + Math.cos(a) * 50}%`, top: `${50 + Math.sin(a) * 50}%` }}
						animate={{ rotate: -360 }}
						transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
						whileHover={{ scale: 1.25 }}>
						<Icon />
					</motion.a>
				);
			})}
		</motion.div>
	</div>
);

const BentoContact = () => {
	const time = useLocalTime();
	const [answers, setAnswers] = useState<Answers>({});
	const [step, setStep] = useState(0);
	const [typing, setTyping] = useState(true);
	const [draft, setDraft] = useState("");
	const [sent, setSent] = useState(false);
	const [copied, setCopied] = useState(false);
	const scroller = useRef<HTMLDivElement>(null);
	const done = step >= STEPS.length;

	useEffect(() => {
		setTyping(true);
		const t = window.setTimeout(() => setTyping(false), 900);
		return () => window.clearTimeout(t);
	}, [step]);

	useEffect(() => {
		scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
	}, [step, typing, sent]);

	const answer = (value: string) => {
		if (!value.trim()) return;
		setAnswers((a) => ({ ...a, [STEPS[step].key]: value.trim() }));
		setDraft("");
		setStep((s) => s + 1);
	};

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		answer(draft);
	};

	const send = () => {
		setSent(true);
		// ponytail: mailto hand-off, swap for an API route (Resend) if you want in-page sending
		window.setTimeout(() => {
			window.location.href = mailto(`${answers.topic} — ${answers.name}`, `${answers.message}\n\n— ${answers.name} (${answers.email})`);
		}, 1200);
	};

	const current = STEPS[step];

	return (
		<section className='grid gap-4 md:grid-cols-12'>
			<motion.div className='md:col-span-7' initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
				<Tile className='flex h-[75vh] min-h-[560px] flex-col'>
					<div className='flex items-center gap-3 border-b border-[#1d232b]/10 p-5'>
						<div className='relative'>
							<img src={me.photo} alt='' className='h-11 w-11 rounded-full object-cover' />
							<span className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500' />
						</div>
						<div>
							<p className='font-display font-bold'>{me.name}</p>
							<p className='text-sm text-[#1d232b]/60'>{typing && !done ? "typing…" : "Online · replies within a day"}</p>
						</div>
					</div>

					<div ref={scroller} className='flex-1 space-y-3 overflow-y-auto p-5'>
						{STEPS.slice(0, Math.min(step + 1, STEPS.length)).map((s, i) => (
							<div key={s.key} className='space-y-3'>
								{(i < step || !typing) && <Bubble from='me'>{s.ask(answers)}</Bubble>}
								{answers[s.key] && <Bubble from='you'>{answers[s.key]}</Bubble>}
							</div>
						))}
						{typing && (
							<Bubble from='me'>
								<Typing />
							</Bubble>
						)}
						{done && !typing && (
							<Bubble from='me'>
								<p>Perfect, {answers.name}. Here’s what I’ll get:</p>
								<div className='mt-3 rounded-2xl bg-[#f4efe9] p-3 text-sm'>
									<p><b>About:</b> {answers.topic}</p>
									<p className='mt-1'><b>Message:</b> {answers.message}</p>
									<p className='mt-1'><b>Reply to:</b> {answers.email}</p>
								</div>
								<div className='relative mt-3'>
									{sent && <Confetti />}
									<motion.button
										onClick={send}
										disabled={sent}
										whileHover={{ scale: 1.04 }}
										whileTap={{ scale: 0.95 }}
										className='flex w-full items-center justify-center gap-2 rounded-full bg-[#dc5c48] px-5 py-3 font-semibold text-white'>
										{sent ? "Sent — opening your mail app 🎉" : <>Send it <FiSend /></>}
									</motion.button>
								</div>
							</Bubble>
						)}
					</div>

					<AnimatePresence>
						{!done && !typing && (
							<motion.form
								onSubmit={onSubmit}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								className='border-t border-[#1d232b]/10 p-4'>
								{current.chips && (
									<div className='mb-3 flex flex-wrap gap-2'>
										{current.chips.map((c, i) => (
											<motion.button
												key={c}
												type='button'
												onClick={() => answer(c)}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: i * 0.06 }}
												className='rounded-full border border-[#1d232b]/15 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:border-[#dc5c48] hover:text-[#dc5c48]'>
												{c}
											</motion.button>
										))}
									</div>
								)}
								<div className='flex gap-2'>
									<input
										autoFocus
										type={current.type ?? "text"}
										value={draft}
										onChange={(e) => setDraft(e.target.value)}
										placeholder={current.placeholder}
										className='flex-1 rounded-full border border-[#1d232b]/10 bg-white px-5 py-3 outline-none focus:border-[#dc5c48]'
									/>
									<button type='submit' className='flex h-12 w-12 items-center justify-center rounded-full bg-[#1d232b] text-white transition-colors hover:bg-[#dc5c48]' aria-label='Send'>
										<FiSend />
									</button>
								</div>
							</motion.form>
						)}
					</AnimatePresence>
				</Tile>
			</motion.div>

			<motion.div className='grid gap-4 md:col-span-5' initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
				<Tile className='flex items-center justify-center p-8' glow='rgba(72,139,155,.25)'>
					<Orbit />
				</Tile>
				<div className='grid grid-cols-2 gap-4'>
					<Tile className='p-5'>
						<p className='font-mono text-[11px] uppercase tracking-[0.14em] text-[#1d232b]/60'>Local time</p>
						<p className='font-display mt-2 text-3xl font-extrabold tabular-nums'>{time.slice(0, 5)}</p>
						<p className='text-sm text-[#1d232b]/60'>{me.location}</p>
					</Tile>
					<button
						onClick={async () => {
							await navigator.clipboard.writeText(email());
							setCopied(true);
							window.setTimeout(() => setCopied(false), 1800);
						}}
						className='text-left'>
						<Tile className='h-full p-5'>
							<p className='font-mono text-[11px] uppercase tracking-[0.14em] text-[#1d232b]/60'>{copied ? "Copied ✓" : "Copy email"}</p>
							<Logo className='mt-2 h-10 w-10 text-[#dc5c48]' animateOnMount={false} />
							<p className='mt-2 truncate text-sm font-semibold'>{email()}</p>
						</Tile>
					</button>
				</div>
			</motion.div>
		</section>
	);
};

export default BentoContact;
