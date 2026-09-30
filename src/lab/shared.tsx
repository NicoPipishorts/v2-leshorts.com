import {
	animate,
	motion,
	useInView,
	useMotionValue,
	useReducedMotion,
	useSpring,
} from "framer-motion";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { LOGO_HEX_PATH, LOGO_MARK_PATH } from "../components/Logo";
import "./lab.css";

/** Pointy-top hexagon matching the logo outline. */
export const HEX_CLIP = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

export const EASE = [0.76, 0, 0.24, 1] as const;
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Paints html/body so overscroll and route swaps never flash the legacy grey. */
export const usePageBg = (color: string) => {
	useEffect(() => {
		const prev = document.body.style.background;
		document.body.style.background = color;
		document.documentElement.style.background = color;
		return () => {
			document.body.style.background = prev;
			document.documentElement.style.background = "";
		};
	}, [color]);
};

export const useLocalTime = (tz = "Europe/Paris") => {
	const fmt = () =>
		new Intl.DateTimeFormat("en-GB", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			timeZone: tz,
		}).format(new Date());
	const [time, setTime] = useState(fmt);
	useEffect(() => {
		const id = window.setInterval(() => setTime(fmt()), 1000);
		return () => window.clearInterval(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return time;
};

/** Letters (or words) rise out of a mask, staggered. Lines only break between words. */
export const SplitText = ({
	text,
	className = "",
	delay = 0,
	stagger = 0.035,
	by = "char",
	inView = false,
}: {
	text: string;
	className?: string;
	delay?: number;
	stagger?: number;
	by?: "char" | "word";
	inView?: boolean;
}) => {
	const anim = { y: "0%", rotate: 0 };
	let n = 0;
	const piece = (p: string, key: number) => (
		<span key={key} aria-hidden className='inline-block overflow-hidden pb-[0.08em] align-bottom'>
			<motion.span
				className='inline-block will-change-transform'
				initial={{ y: "110%", rotate: 6 }}
				{...(inView ? { whileInView: anim, viewport: { once: true, margin: "-10%" } } : { animate: anim })}
				transition={{ duration: 0.9, ease: EASE_OUT, delay: delay + n++ * stagger }}>
				{p}
			</motion.span>
		</span>
	);
	return (
		<span className={`inline-block ${className}`} aria-label={text}>
			{text.split(" ").map((w, i) => (
				<Fragment key={i}>
					{i > 0 && " "}
					<span className='inline-block whitespace-nowrap'>{by === "char" ? [...w].map((c, j) => piece(c, j)) : piece(w, 0)}</span>
				</Fragment>
			))}
		</span>
	);
};

export const Reveal = ({
	children,
	className = "",
	delay = 0,
	y = 40,
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
	y?: number;
}) => (
	<motion.div
		className={className}
		initial={{ opacity: 0, y }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true, margin: "-8%" }}
		transition={{ duration: 0.9, ease: EASE_OUT, delay }}>
		{children}
	</motion.div>
);

/** Element drifts toward the cursor while hovered. */
export const Magnetic = ({
	children,
	strength = 0.35,
	className = "",
}: {
	children: ReactNode;
	strength?: number;
	className?: string;
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const x = useSpring(0, { stiffness: 220, damping: 15, mass: 0.4 });
	const y = useSpring(0, { stiffness: 220, damping: 15, mass: 0.4 });
	return (
		<motion.div
			ref={ref}
			className={`inline-block ${className}`}
			style={{ x, y }}
			onMouseMove={(e) => {
				const r = ref.current!.getBoundingClientRect();
				x.set((e.clientX - r.left - r.width / 2) * strength);
				y.set((e.clientY - r.top - r.height / 2) * strength);
			}}
			onMouseLeave={() => {
				x.set(0);
				y.set(0);
			}}>
			{children}
		</motion.div>
	);
};

export const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
	const ref = useRef<HTMLSpanElement>(null);
	const seen = useInView(ref, { once: true });
	const [n, setN] = useState(0);
	useEffect(() => {
		if (!seen) return;
		const c = animate(0, to, { duration: 1.8, ease: EASE_OUT, onUpdate: (v) => setN(Math.round(v)) });
		return () => c.stop();
	}, [seen, to]);
	return (
		<span ref={ref}>
			{n.toLocaleString("en-US")}
			{suffix}
		</span>
	);
};

export const Marquee = ({
	children,
	speed = 30,
	reverse = false,
	className = "",
}: {
	children: ReactNode;
	speed?: number;
	reverse?: boolean;
	className?: string;
}) => (
	<div className={`flex overflow-hidden whitespace-nowrap ${className}`}>
		{[0, 1].map((k) => (
			<div
				key={k}
				aria-hidden={k === 1}
				className='lab-marquee flex shrink-0 items-center'
				style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}>
				{children}
			</div>
		))}
	</div>
);

/** Cursor position as motion values (for spotlights, follow-images, custom cursors). */
export const useMouse = () => {
	const x = useMotionValue(-999);
	const y = useMotionValue(-999);
	useEffect(() => {
		const move = (e: PointerEvent) => {
			x.set(e.clientX);
			y.set(e.clientY);
		};
		window.addEventListener("pointermove", move);
		return () => window.removeEventListener("pointermove", move);
	}, [x, y]);
	return { x, y };
};

const LENS = 110;

type Particle = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; c: string; s: number };

/**
 * The hexagon logo rebuilt from a few thousand particles: they fly in from
 * everywhere, the cursor pushes them around, a click detonates them.
 * `burstKey` changes → explode from the centre (used by the contact form).
 */
export const ParticleLogo = ({
	className = "",
	colors = ["#dc5c48", "#e8836f", "#b79a77"],
	hexColor = "#488b9b",
	scale = 0.78,
	gap = 4,
	burstKey = 0,
	interactive = true,
}: {
	className?: string;
	colors?: string[];
	hexColor?: string;
	scale?: number;
	gap?: number;
	burstKey?: number;
	interactive?: boolean;
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const api = useRef<{ burst: (x: number, y: number, power: number) => void } | null>(null);
	const reduce = useReducedMotion();

	useEffect(() => {
		const canvas = canvasRef.current!;
		const ctx = canvas.getContext("2d")!;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		let w = 0;
		let h = 0;
		let parts: Particle[] = [];
		const mouse = { x: -9999, y: -9999 };
		let raf = 0;
		// soft spring for the fly-in and after bursts, stiff otherwise so the lens tracks the cursor
		let softUntil = performance.now() + (reduce ? 0 : 1800);

		const build = () => {
			// layout size, not getBoundingClientRect: the hero scales this canvas on scroll
			w = canvas.clientWidth;
			h = canvas.clientHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			const size = Math.min(w, h) * scale;
			const k = size / 218;
			const off = document.createElement("canvas");
			off.width = Math.ceil(size);
			off.height = Math.ceil(size);
			const o = off.getContext("2d")!;
			o.scale(k, k);
			o.fillStyle = "#f00";
			o.fill(new Path2D(LOGO_MARK_PATH));
			o.strokeStyle = "#00f";
			o.lineWidth = 7;
			o.stroke(new Path2D(LOGO_HEX_PATH));
			const data = o.getImageData(0, 0, off.width, off.height).data;
			const ox = (w - size) / 2;
			const oy = (h - size) / 2;
			const old = parts;
			parts = [];
			for (let y = 0; y < off.height; y += gap) {
				for (let x = 0; x < off.width; x += gap) {
					const i = (y * off.width + x) * 4;
					if (data[i + 3] < 128) continue;
					const isHex = data[i + 2] > data[i];
					const prev = old[parts.length];
					const a = Math.random() * Math.PI * 2;
					const d = Math.max(w, h) * (0.6 + Math.random() * 0.6);
					parts.push({
						x: prev?.x ?? (reduce ? ox + x : w / 2 + Math.cos(a) * d),
						y: prev?.y ?? (reduce ? oy + y : h / 2 + Math.sin(a) * d),
						vx: 0,
						vy: 0,
						tx: ox + x,
						ty: oy + y,
						c: isHex ? hexColor : colors[(Math.random() * colors.length) | 0],
						s: isHex ? 1.6 : 1.4 + Math.random() * 1.2,
					});
				}
			}
		};

		const tick = () => {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, w, h);
			const soft = performance.now() < softUntil;
			const k = soft ? 0.014 : 0.11;
			const damp = soft ? 0.9 : 0.74;
			for (const p of parts) {
				// Lens: bend each particle's *home* away from the cursor, so the hole is always centred on it.
				let gx = p.tx;
				let gy = p.ty;
				const dx = p.tx - mouse.x;
				const dy = p.ty - mouse.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < LENS) {
					const f = 1 - dist / LENS;
					const push = f * f * LENS * 0.85;
					gx += (dx / (dist || 1)) * push;
					gy += (dy / (dist || 1)) * push;
				}
				p.vx += (gx - p.x) * k;
				p.vy += (gy - p.y) * k;
				p.vx *= damp;
				p.vy *= damp;
				p.x += p.vx;
				p.y += p.vy;
				ctx.fillStyle = p.c;
				ctx.fillRect(p.x, p.y, p.s, p.s);
			}
			raf = requestAnimationFrame(tick);
		};

		api.current = {
			burst: (bx, by, power) => {
				softUntil = performance.now() + 1400;
				for (const p of parts) {
					const dx = p.x - bx;
					const dy = p.y - by;
					const d = Math.sqrt(dx * dx + dy * dy) + 1;
					const f = (power * (0.5 + Math.random())) / Math.sqrt(d);
					p.vx += (dx / d) * f;
					p.vy += (dy / d) * f;
				}
			},
		};

		// screen → canvas space, undoing any CSS scale on an ancestor
		const local = (e: PointerEvent) => {
			const r = canvas.getBoundingClientRect();
			return { x: ((e.clientX - r.left) * w) / r.width, y: ((e.clientY - r.top) * h) / r.height };
		};
		const onMove = (e: PointerEvent) => Object.assign(mouse, local(e));
		const onLeave = () => {
			mouse.x = mouse.y = -9999;
		};
		const onClick = (e: PointerEvent) => {
			const m = local(e);
			api.current?.burst(m.x, m.y, 90);
		};

		build();
		tick();
		const ro = new ResizeObserver(build);
		ro.observe(canvas);
		if (interactive) {
			window.addEventListener("pointermove", onMove);
			canvas.addEventListener("pointerleave", onLeave);
			canvas.addEventListener("pointerdown", onClick);
		}
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			window.removeEventListener("pointermove", onMove);
			canvas.removeEventListener("pointerleave", onLeave);
			canvas.removeEventListener("pointerdown", onClick);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [colors.join(), hexColor, scale, gap, interactive, reduce]);

	useEffect(() => {
		if (!burstKey) return;
		const c = canvasRef.current!;
		api.current?.burst(c.clientWidth / 2, c.clientHeight / 2, 160);
	}, [burstKey]);

	return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden />;
};
