import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useContext, useEffect, useRef, useState, type FormEvent } from "react";
import { IgniteTheme, PARTICLES } from "./Layout";
import { TURNSTILE_SITE_KEY, Turnstile } from "./Turnstile";
import { email, useContent } from "./data";
import { EASE_OUT, Magnetic, ParticleLogo, SplitText, useLocalTime, type LogoPlacement } from "./shared";
import { FiArrowUpRight, FiCheck, FiChevronDown } from "react-icons/fi";

/** Logo spot in the fixed, screen-sized canvas: a top-right mark that stays put while the page scrolls. */
const placeLogo: LogoPlacement = (w, h) => {
	if (w < 768) return { cx: w * 0.77, cy: 80 + w * 0.21, size: w * 0.33 };
	const size = Math.min(h * 0.5, w * 0.36);
	return { cx: w - size * 0.55 - w * 0.03, cy: 90 + size * 0.55, size };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Errors = Partial<Record<"name" | "email" | "message", string>>;

/** A letter that gets shoved away from the cursor and springs back. */
const RepelChar = ({ ch }: { ch: string }) => {
	const ref = useRef<HTMLSpanElement>(null);
	const x = useSpring(0, { stiffness: 150, damping: 12 });
	const y = useSpring(0, { stiffness: 150, damping: 12 });
	const r = useSpring(0, { stiffness: 150, damping: 12 });
	useEffect(() => {
		const move = (e: PointerEvent) => {
			const b = ref.current!.getBoundingClientRect();
			const dx = b.left + b.width / 2 - e.clientX;
			const dy = b.top + b.height / 2 - e.clientY;
			const d = Math.hypot(dx, dy);
			const f = Math.max(0, 1 - d / 220);
			x.set((dx / (d || 1)) * f * 90);
			y.set((dy / (d || 1)) * f * 90);
			r.set(f * (dx > 0 ? 25 : -25));
		};
		window.addEventListener("pointermove", move);
		return () => window.removeEventListener("pointermove", move);
	}, [x, y, r]);
	return (
		<motion.span ref={ref} style={{ x, y, rotate: r }} className='inline-block'>
			{ch === " " ? " " : ch}
		</motion.span>
	);
};


const Field = ({
	label,
	name,
	type = "text",
	area = false,
	error,
	onEdit,
}: {
	label: string;
	name: string;
	type?: string;
	area?: boolean;
	error?: string;
	onEdit: () => void;
}) => {
	const Tag = area ? "textarea" : "input";
	return (
		<label className='group relative block'>
			<Tag
				name={name}
				type={type}
				placeholder=' '
				rows={area ? 4 : undefined}
				onInput={onEdit}
				aria-invalid={!!error}
				aria-describedby={error ? `${name}-error` : undefined}
				className={`peer w-full resize-none border-b bg-transparent pb-3 pt-7 text-xl text-ig-fg outline-none transition-colors md:text-2xl ${
					error ? "border-[#dc5c48]" : "border-ig-fg/20"
				}`}
			/>
			<span className='pointer-events-none absolute left-0 top-7 font-mono text-sm uppercase tracking-[0.16em] text-ig-fg/40 transition-all duration-300 peer-focus:top-0 peer-focus:text-[11px] peer-focus:text-[#dc5c48] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px]'>
				{label}
			</span>
			<span className='absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#dc5c48] transition-transform duration-500 peer-focus:scale-x-100' />
			<AnimatePresence>
				{error && (
					<motion.span
						id={`${name}-error`}
						role='alert'
						className='mt-2 flex items-center gap-2 overflow-hidden text-sm text-[#dc5c48]'
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}>
						<span className='flex h-4 w-4 items-center justify-center rounded-full bg-[#dc5c48] text-[10px] font-bold text-[#0b0c0f]'>!</span>
						{error}
					</motion.span>
				)}
			</AnimatePresence>
		</label>
	);
};

/** Phone-sized topic picker: a custom dropdown instead of chips that wrap. */
const TopicSelect = ({ topics, value, onChange }: { topics: string[]; value: number; onChange: (i: number) => void }) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!open) return;
		const close = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
		document.addEventListener("pointerdown", close);
		return () => document.removeEventListener("pointerdown", close);
	}, [open]);
	return (
		<div ref={ref} className='relative md:hidden'>
			<button
				type='button'
				aria-haspopup='listbox'
				aria-expanded={open}
				onClick={() => setOpen((o) => !o)}
				className='flex w-full items-center justify-between rounded-2xl bg-[#dc5c48] px-5 py-3.5 text-left text-[#0b0c0f]'>
				<span>{topics[value]}</span>
				<FiChevronDown className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
			</button>
			<AnimatePresence>
				{open && (
					<motion.ul
						role='listbox'
						className='absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-ig-fg/15 bg-ig-panel shadow-xl'
						initial={{ opacity: 0, y: -8, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -8, scale: 0.98 }}
						transition={{ duration: 0.18 }}>
						{topics.map((t, i) => (
							<li key={t}>
								<button
									type='button'
									role='option'
									aria-selected={i === value}
									onClick={() => {
										onChange(i);
										setOpen(false);
									}}
									className={`flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-ig-fg/5 ${i === value ? "text-[#dc5c48]" : "text-ig-fg"}`}>
									{t}
									{i === value && <FiCheck />}
								</button>
							</li>
						))}
					</motion.ul>
				)}
			</AnimatePresence>
		</div>
	);
};

type Status = "idle" | "sending" | "sent" | "error";

const IgniteContact = () => {
	const time = useLocalTime();
	const { me, ui, lang } = useContent();
	const [topic, setTopic] = useState(0);
	const [burst, setBurst] = useState(0);
	const [status, setStatus] = useState<Status>("idle");
	const [copied, setCopied] = useState(false);
	const palette = PARTICLES[useContext(IgniteTheme)];
	// denser sampling on the small phone-sized mark so the logo still reads
	const [formHeight, setFormHeight] = useState<number>();
	const formRef = useRef<HTMLFormElement>(null);
	const [particleGap] = useState(() => (window.matchMedia("(max-width: 767px)").matches ? 3 : 5));
	const [token, setToken] = useState("");
	const [errors, setErrors] = useState<Errors>({});
	const [serverError, setServerError] = useState<"captcha" | "invalid" | "other" | null>(null);
	const clearError = (k: keyof Errors) => () => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
	// the heading shrinks as you scroll so the send button comes into view sooner
	const [desktop] = useState(() => window.matchMedia("(min-width: 768px)").matches);
	const { scrollY } = useScroll();
	// sized to the longest line so "PARLONS-" fits as well as "LET'S" (Unbounded ≈ 0.95em per letter)
	const longest = Math.max(ui.contactLine1.length, ui.contactLine2.length);
	const bigVw = Math.min(desktop ? 13 : 18, 88 / (longest * 0.95));
	const headingSize = useTransform(scrollY, [0, 320], [`${bigVw}vw`, `${bigVw * 0.55}vw`]);
	const [resetCaptcha, setResetCaptcha] = useState(0);
	// Without a site key (unconfigured prod) the server skips the check too, so don't block sending.
	const waitingForCaptcha = !!TURNSTILE_SITE_KEY && !token;
	const [captchaFailed, setCaptchaFailed] = useState(false);
	const onCaptchaError = useCallback(() => setCaptchaFailed(true), []);
	const onCaptchaToken = useCallback((t: string) => {
		setToken(t);
		if (t) setCaptchaFailed(false);
	}, []);

	// Success path shared by real sends and the local test: flock animation + thank-you swap.
	const celebrate = () => {
		if (formRef.current) setFormHeight(formRef.current.offsetHeight); // hold the space during the swap
		formRef.current?.reset();
		setServerError(null);
		setBurst((n) => n + 1);
		setStatus("sent");
	};

	const submit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
		// Locally: no validation, no network — just play the animation.
		if (import.meta.env.DEV) return celebrate();
		const found: Errors = {};
		if (!f.name?.trim()) found.name = ui.errName;
		if (!EMAIL_RE.test(f.email?.trim() ?? "")) found.email = ui.errEmail;
		if (!f.message?.trim()) found.message = ui.errMessage;
		setErrors(found);
		const first = (["name", "email", "message"] as const).find((k) => found[k]);
		if (first) {
			form.querySelector<HTMLElement>(`[name=${first}]`)?.focus();
			return;
		}
		setServerError(null);
		setFormHeight(form.offsetHeight); // hold the space while the form swaps for the thank-you
		setStatus("sending");
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...f, topic: ui.topics[topic], lang, token }),
			});
			if (!res.ok) {
				setServerError(res.status === 403 ? "captcha" : res.status === 400 ? "invalid" : "other");
				setStatus("error");
				return;
			}
			celebrate();
		} catch {
			setServerError("other");
			setStatus("error");
		} finally {
			setResetCaptcha((n) => n + 1); // tokens are single-use
		}
	};

	const copy = async () => {
		await navigator.clipboard.writeText(email());
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1800);
	};

	const label = { idle: ui.send, sending: ui.sending, sent: ui.sent, error: ui.send }[status];

	return (
		<section className='relative min-h-screen overflow-hidden px-4 pb-24 pt-32 md:px-8'>
			{import.meta.env.DEV && (
				<button
					type='button'
					onClick={() => (status === "sent" ? setStatus("idle") : celebrate())}
					className='fixed bottom-4 left-4 z-50 rounded-full bg-ig-fg px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-ig-bg shadow-lg'>
					{status === "sent" ? "↺ Reset form (dev)" : "▶ Test animation (dev)"}
				</button>
			)}
			{/* fixed to the screen: the logo stays put while scrolling and the "sent" flight always plays in view */}
			<div className='pointer-events-none fixed inset-0 opacity-80 md:opacity-100'>
				<ParticleLogo flyKey={burst} gap={particleGap} interactive={false} colors={palette.colors} hexColor={palette.hex} dot={palette.dot} place={placeLogo} showAtRest={desktop} />
			</div>

			<motion.h1 style={{ fontSize: headingSize }} className='font-unbounded relative select-none whitespace-nowrap font-black uppercase leading-[0.85]'>
				{[...ui.contactLine1].map((c, i) => (
					<RepelChar key={i} ch={c} />
				))}
				<br />
				<span className='text-[#dc5c48]'>
					{[...ui.contactLine2].map((c, i) => (
						<RepelChar key={i} ch={c} />
					))}
				</span>
			</motion.h1>

			<div className='relative mt-16 grid gap-16 md:grid-cols-12'>
				<div className='md:col-span-7' style={{ minHeight: formHeight }}>
				<AnimatePresence mode='wait'>
				{status === "sent" ? (
					<motion.div key='thanks' aria-live='polite' initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: EASE_OUT }}>
						<h2 className='font-unbounded text-6xl font-black uppercase leading-[0.9] text-[#dc5c48] md:text-8xl'>
							<SplitText text={ui.thanks} delay={0.4} />
						</h2>
						<p className='mt-8 max-w-xl text-xl text-ig-fg/80 md:text-2xl'>{ui.sentNote}</p>
						<button onClick={() => setStatus("idle")} className='mt-10 rounded-full border border-ig-fg/20 px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:border-[#dc5c48] hover:text-[#dc5c48]'>
							{ui.sendAnother}
						</button>
					</motion.div>
				) : (
				<motion.form
					key='form'
					ref={formRef}
					onSubmit={submit}
					noValidate
					className='space-y-10'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					// the flock passes behind the form, then it dissolves into the thank-you
					exit={{ opacity: 0, y: 30, filter: "blur(10px)", transition: { delay: 1.9, duration: 0.5 } }}>
					{/* honeypot: hidden from people, irresistible to bots */}
					<input name='website' tabIndex={-1} autoComplete='off' aria-hidden className='absolute left-[-9999px] h-px w-px opacity-0' />
					<div>
						<p className='mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ig-fg/40'>{ui.reachingOut}</p>
						<TopicSelect topics={ui.topics} value={topic} onChange={setTopic} />
						<div className='hidden flex-wrap gap-3 md:flex'>
							{ui.topics.map((t, i) => (
								<button
									key={t}
									type='button'
									onClick={() => setTopic(i)}
									className={`relative rounded-full border px-5 py-2 transition-colors ${topic === i ? "border-[#dc5c48] text-[#0b0c0f]" : "border-ig-fg/20 text-ig-fg/80 hover:border-ig-fg/60"}`}>
									{topic === i && <motion.span layoutId='topic' className='absolute inset-0 -z-0 rounded-[inherit] bg-[#dc5c48]' transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
									<span className='relative'>{t}</span>
								</button>
							))}
						</div>
					</div>
					<div className='grid gap-10 md:grid-cols-2'>
						<Field label={ui.yourName} name='name' error={errors.name} onEdit={clearError("name")} />
						<Field label={ui.yourEmail} name='email' type='email' error={errors.email} onEdit={clearError("email")} />
					</div>
					<Field label={ui.tellMe} name='message' area error={errors.message} onEdit={clearError("message")} />
					<Turnstile onToken={onCaptchaToken} onError={onCaptchaError} resetKey={resetCaptcha} lang={lang} />
					<Magnetic>
						<button
							type='submit'
							disabled={status === "sending" || waitingForCaptcha}
							className='relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[#dc5c48] font-mono text-xs uppercase tracking-[0.18em] text-[#0b0c0f] transition-transform hover:scale-110 disabled:animate-pulse'>
							<AnimatePresence mode='wait'>
								<motion.span key={label} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }}>
									{label}
								</motion.span>
							</AnimatePresence>
						</button>
					</Magnetic>
					{captchaFailed && !token && (
						<div role='alert' className='flex flex-wrap items-center gap-3 rounded-2xl border border-[#dc5c48]/40 bg-[#dc5c48]/10 p-4 text-ig-fg'>
							<span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#dc5c48] text-xs font-bold text-[#0b0c0f]'>!</span>
							<p className='flex-1'>{ui.errCaptchaLoad}</p>
							<button
								type='button'
								onClick={() => {
									setCaptchaFailed(false);
									setResetCaptcha((n) => n + 1);
								}}
								className='rounded-full border border-ig-fg/20 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] hover:border-[#dc5c48] hover:text-[#dc5c48]'>
								{ui.retry}
							</button>
							<a href={`mailto:${email()}`} className='underline decoration-[#dc5c48] underline-offset-4'>
								{email()}
							</a>
						</div>
					)}
					<div aria-live='polite' className='min-h-[1.5em]'>
						<AnimatePresence>
							{status === "error" && serverError && (
								<motion.div
									className='flex items-start gap-3 rounded-2xl border border-[#dc5c48]/40 bg-[#dc5c48]/10 p-4 text-ig-fg'
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}>
									<span className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#dc5c48] text-xs font-bold text-[#0b0c0f]'>!</span>
									{serverError === "other" ? (
										<a href={`mailto:${email()}`} className='underline decoration-[#dc5c48] underline-offset-4'>
											{ui.error}
										</a>
									) : (
										<p>{serverError === "captcha" ? ui.errCaptcha : ui.errInvalid}</p>
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</motion.form>
				)}
				</AnimatePresence>
				</div>

				<aside className='space-y-10 md:col-span-4 md:col-start-9'>
					<div>
						<p className='font-mono text-[11px] uppercase tracking-[0.2em] text-ig-fg/40'>{ui.preferEmail}</p>
						<button onClick={copy} className='group mt-2 text-left text-2xl'>
							<span className='border-b border-ig-fg/30 transition-colors group-hover:border-[#dc5c48] group-hover:text-[#dc5c48]'>{email()}</span>
							<span className='ml-3 font-mono text-xs uppercase text-ig-fg/40'>{copied ? ui.copied : ui.copy}</span>
						</button>
					</div>
					<div>
						<p className='font-mono text-[11px] uppercase tracking-[0.2em] text-ig-fg/40'>{ui.elsewhere}</p>
						<ul className='mt-2'>
							{Object.entries(me.links).map(([k, v]) => (
								<li key={k}>
									<a href={v} target='_blank' rel='noreferrer' className='group flex items-center justify-between border-b border-ig-fg/10 py-3 text-xl capitalize'>
										{k}
										<span className='transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#dc5c48]'>
											<FiArrowUpRight />
										</span>
									</a>
								</li>
							))}
						</ul>
					</div>
					<div className='font-mono text-xs uppercase tracking-[0.18em] text-ig-fg/50'>
						<p>{me.location} — {time}</p>
						<p className='mt-1'>{ui.replies}</p>
					</div>
				</aside>
			</div>
		</section>
	);
};

export default IgniteContact;
