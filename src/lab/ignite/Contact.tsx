import { AnimatePresence, motion, useSpring } from "framer-motion";
import { useContext, useEffect, useRef, useState, type FormEvent } from "react";
import { IgniteTheme, PARTICLES } from "./Layout";
import { TURNSTILE_SITE_KEY, Turnstile } from "../Turnstile";
import { email, useLab } from "../data";
import { Magnetic, ParticleLogo, useLocalTime } from "../shared";

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


const Field = ({ label, name, type = "text", area = false }: { label: string; name: string; type?: string; area?: boolean }) => {
	const Tag = area ? "textarea" : "input";
	return (
		<label className='group relative block'>
			<Tag
				name={name}
				type={type}
				required
				placeholder=' '
				rows={area ? 4 : undefined}
				className='peer w-full resize-none border-b border-ig-fg/20 bg-transparent pb-3 pt-7 text-xl text-ig-fg outline-none md:text-2xl'
			/>
			<span className='pointer-events-none absolute left-0 top-7 font-mono text-sm uppercase tracking-[0.16em] text-ig-fg/40 transition-all duration-300 peer-focus:top-0 peer-focus:text-[11px] peer-focus:text-[#dc5c48] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px]'>
				{label}
			</span>
			<span className='absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#dc5c48] transition-transform duration-500 peer-focus:scale-x-100' />
		</label>
	);
};

type Status = "idle" | "sending" | "sent" | "error";

const IgniteContact = () => {
	const time = useLocalTime();
	const { me, ui, lang } = useLab();
	const [topic, setTopic] = useState(0);
	const [burst, setBurst] = useState(0);
	const [status, setStatus] = useState<Status>("idle");
	const [copied, setCopied] = useState(false);
	const palette = PARTICLES[useContext(IgniteTheme)];
	const [token, setToken] = useState("");
	const [resetCaptcha, setResetCaptcha] = useState(0);
	// Without a site key (unconfigured prod) the server skips the check too, so don't block sending.
	const waitingForCaptcha = !!TURNSTILE_SITE_KEY && !token;

	const submit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const f = Object.fromEntries(new FormData(form));
		setStatus("sending");
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...f, topic: ui.topics[topic], lang, token }),
			});
			if (!res.ok) throw new Error(String(res.status));
			form.reset();
			setBurst((n) => n + 1);
			setStatus("sent");
		} catch {
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
			<div className='pointer-events-none absolute -right-[10%] top-[10%] h-[80vh] w-[80vh] opacity-60 md:opacity-100'>
				<ParticleLogo burstKey={burst} gap={5} interactive={false} colors={palette.colors} hexColor={palette.hex} dot={palette.dot} />
			</div>

			<h1 className='font-unbounded relative select-none text-[18vw] font-black uppercase leading-[0.85] md:text-[13vw]'>
				{[...ui.contactLine1].map((c, i) => (
					<RepelChar key={i} ch={c} />
				))}
				<br />
				<span className='text-[#dc5c48]'>
					{[...ui.contactLine2].map((c, i) => (
						<RepelChar key={i} ch={c} />
					))}
				</span>
			</h1>

			<div className='relative mt-16 grid gap-16 md:grid-cols-12'>
				<form onSubmit={submit} className='space-y-10 md:col-span-7'>
					{/* honeypot: hidden from people, irresistible to bots */}
					<input name='website' tabIndex={-1} autoComplete='off' aria-hidden className='absolute left-[-9999px] h-px w-px opacity-0' />
					<div>
						<p className='mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ig-fg/40'>{ui.reachingOut}</p>
						<div className='flex flex-wrap gap-3'>
							{ui.topics.map((t, i) => (
								<button
									key={t}
									type='button'
									onClick={() => setTopic(i)}
									className={`relative rounded-full border px-5 py-2 transition-colors ${topic === i ? "border-[#dc5c48] text-[#0b0c0f]" : "border-ig-fg/20 text-ig-fg/80 hover:border-ig-fg/60"}`}>
									{topic === i && <motion.span layoutId='topic' className='absolute inset-0 -z-0 rounded-full bg-[#dc5c48]' transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
									<span className='relative'>{t}</span>
								</button>
							))}
						</div>
					</div>
					<div className='grid gap-10 md:grid-cols-2'>
						<Field label={ui.yourName} name='name' />
						<Field label={ui.yourEmail} name='email' type='email' />
					</div>
					<Field label={ui.tellMe} name='message' area />
					<Turnstile onToken={setToken} resetKey={resetCaptcha} lang={lang} />
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
					<div aria-live='polite' className='min-h-[1.5em]'>
						{status === "sent" && <p className='text-lg text-ig-ok'>{ui.sentNote}</p>}
						{status === "error" && (
							<a href={`mailto:${email()}`} className='text-lg text-[#dc5c48] underline underline-offset-4'>
								{ui.error}
							</a>
						)}
					</div>
				</form>

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
										<span className='transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#dc5c48]'>↗</span>
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
