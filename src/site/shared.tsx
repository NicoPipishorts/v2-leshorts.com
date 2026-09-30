import {
	animate,
	motion,
	useInView,
	useReducedMotion,
	useSpring,
} from "framer-motion";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { LOGO_HEX_PATH, LOGO_MARK_PATH } from "../components/Logo";
import "./site.css";

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
				className='fx-marquee flex shrink-0 items-center'
				style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}>
				{children}
			</div>
		))}
	</div>
);

const LENS = 110;

type Particle = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	/** home position in the logo */
	tx: number;
	ty: number;
	/** position in the paper plane, relative to the plane's centre */
	px: number;
	py: number;
	/** departure delay (ms) and wobble phase for the "sent" flight */
	d: number;
	ph: number;
	c: string;
	s: number;
};

/** Where the logo sits inside the canvas (defaults to centred). */
export type LogoPlacement = (w: number, h: number) => { cx: number; cy: number; size: number };

// Paper plane drawn in the logo's 218×218 box, with a folded crease cut out of it.
const PLANE_PATH = "M14 118 L204 26 L132 196 L100 136 Z";
const PLANE_CREASE = "M204 26 L100 136 L114 180";
const PLANE_ANGLE = Math.atan2(26 - 118, 204 - 14); // direction the drawn nose points
// "Message sent" flight: the plane runs one curve; dots peel off the logo at staggered moments
// and chase their spot in it, so the flock streams out like birds and tightens into the plane.
const FLY_MS = 2400;
const STAGGER_MS = 450;
const PEEL_MS = 500;
const RETURN_AT = FLY_MS + 250;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const smooth = (t: number) => {
	const c = Math.min(1, Math.max(0, t));
	return c * c * (3 - 2 * c);
};
const bez = (a: number, b: number, c: number, d: number, t: number) => {
	const u = 1 - t;
	return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};
const bezD = (a: number, b: number, c: number, d: number, t: number) => {
	const u = 1 - t;
	return 3 * u * u * (b - a) + 6 * u * t * (c - b) + 3 * t * t * (d - c);
};

/**
 * The hexagon logo rebuilt from a few thousand particles: they fly in from
 * everywhere, the cursor pushes them around, a click detonates them.
 * `burstKey` changes → explode from the centre.
 * `flyKey` changes → the dots flock into a paper plane, swoop up-right then down
 * through the page and out, then flow back into the logo (contact form "sent").
 * `place` positions the logo inside a larger canvas so that flight has room.
 */
export const ParticleLogo = ({
	className = "",
	colors = ["#dc5c48", "#e8836f", "#b79a77"],
	hexColor = "#488b9b",
	scale = 0.78,
	gap = 4,
	burstKey = 0,
	flyKey = 0,
	interactive = true,
	dot = 1,
	place,
}: {
	className?: string;
	colors?: string[];
	hexColor?: string;
	scale?: number;
	gap?: number;
	burstKey?: number;
	flyKey?: number;
	interactive?: boolean;
	/** dot size multiplier (light backgrounds need chunkier dots to read) */
	dot?: number;
	place?: LogoPlacement;
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const api = useRef<{ burst: (x: number, y: number, power: number) => void; fly: () => void } | null>(null);
	const placeRef = useRef(place);
	placeRef.current = place;
	const reduce = useReducedMotion();

	useEffect(() => {
		const canvas = canvasRef.current!;
		const ctx = canvas.getContext("2d")!;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		let w = 0;
		let h = 0;
		let home = { cx: 0, cy: 0, size: 0 };
		let parts: Particle[] = [];
		const mouse = { x: -9999, y: -9999 };
		let raf = 0;
		// soft spring for the fly-in and after bursts, stiff otherwise so the lens tracks the cursor
		let softUntil = performance.now() + (reduce ? 0 : 1800);
		let flightStart = 0;

		const build = () => {
			// layout size, not getBoundingClientRect: the hero scales this canvas on scroll
			w = canvas.clientWidth;
			h = canvas.clientHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			home = placeRef.current?.(w, h) ?? { cx: w / 2, cy: h / 2, size: Math.min(w, h) * scale };
			const size = home.size;
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
			// same box, plane shape
			o.clearRect(0, 0, 218, 218);
			o.fillStyle = "#000";
			o.fill(new Path2D(PLANE_PATH));
			o.globalCompositeOperation = "destination-out";
			o.lineWidth = 7;
			o.stroke(new Path2D(PLANE_CREASE));
			o.globalCompositeOperation = "source-over";
			const pdata = o.getImageData(0, 0, off.width, off.height).data;
			const planePts: [number, number][] = [];
			for (let y = 0; y < off.height; y += gap)
				for (let x = 0; x < off.width; x += gap) if (pdata[(y * off.width + x) * 4 + 3] > 128) planePts.push([x, y]);
			const ox = home.cx - size / 2;
			const oy = home.cy - size / 2;
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
					const [qx, qy] = planePts[parts.length % planePts.length];
					parts.push({
						x: prev?.x ?? (reduce ? ox + x : home.cx + Math.cos(a) * d),
						y: prev?.y ?? (reduce ? oy + y : home.cy + Math.sin(a) * d),
						vx: 0,
						vy: 0,
						tx: ox + x,
						ty: oy + y,
						// more particles than plane points → a little jitter so they don't stack
						px: qx - size / 2 + (Math.random() - 0.5) * gap,
						py: qy - size / 2 + (Math.random() - 0.5) * gap,
						d: prev?.d ?? Math.random() * STAGGER_MS,
						ph: prev?.ph ?? Math.random() * Math.PI * 2,
						c: isHex ? hexColor : colors[(Math.random() * colors.length) | 0],
						s: (isHex ? 1.6 : 1.4 + Math.random() * 1.2) * dot,
					});
				}
			}
		};

		const tick = () => {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, w, h);
			const now = performance.now();
			let fl = flightStart ? now - flightStart : -1;
			if (fl > RETURN_AT) {
				// the plane has left: dots stream back in from past the top-right and rebuild the logo
				flightStart = 0;
				fl = -1;
				softUntil = now + 2400;
				for (const p of parts) {
					p.x = w + 40 + Math.random() * w * 0.35;
					p.y = -40 - Math.random() * Math.min(h, w) * 0.5;
					p.vx = p.vy = 0;
				}
			}
			// flight curve: a short rise to the top-right, then a long swoop down through the page and out bottom-left
			const m = Math.min(w, h);
			const P0x = home.cx;
			const P0y = home.cy;
			const P1x = Math.min(w * 0.97, home.cx + 0.16 * w);
			const P1y = home.cy - 0.14 * m;
			const P2x = 0.62 * w;
			const P2y = 0.6 * h;
			const P3x = -0.3 * w;
			const P3y = 1.1 * h;
			const planeScale = Math.min(260, 0.5 * w) / (home.size || 1);

			const soft = now < softUntil;
			const k = soft ? 0.014 : 0.11;
			const damp = soft ? 0.9 : 0.74;
			for (const p of parts) {
				const u = fl >= 0 ? fl / FLY_MS : 0; // where the plane is (shared by every dot)
				const f = fl >= 0 ? smooth((fl - p.d) / PEEL_MS) : 0; // how far this dot has left the logo
				if (u >= 1) continue; // plane has flown off-screen
				if (f > 0) {
					const t = easeInOut(u);
					const bx = bez(P0x, P1x, P2x, P3x, t);
					const by = bez(P0y, P1y, P2y, P3y, t);
					const dx = bezD(P0x, P1x, P2x, P3x, t);
					const dy = bezD(P0y, P1y, P2y, P3y, t);
					const len = Math.hypot(dx, dy) || 1;
					// nose follows the curve; heading left, mirror the plane instead of flying it upside down
					const left = dx < 0;
					const ang = Math.atan2(dy, dx) - (left ? Math.PI - PLANE_ANGLE : PLANE_ANGLE);
					const rx = (left ? -p.px : p.px) * planeScale;
					const ry = p.py * planeScale;
					const cos = Math.cos(ang);
					const sin = Math.sin(ang);
					let gx = bx + rx * cos - ry * sin;
					let gy = by + rx * sin + ry * cos;
					// flock wobble across the path: loose while peeling off, calm once the plane has formed
					const wob = 70 * (1 - smooth(fl / (STAGGER_MS + PEEL_MS + 350))) * Math.sin(fl / 90 + p.ph);
					gx += (-dy / len) * wob;
					gy += (dx / len) * wob;
					// ease out of the logo instead of jumping
					gx = p.tx + (gx - p.tx) * f;
					gy = p.ty + (gy - p.ty) * f;
					p.vx = (p.vx + (gx - p.x) * 0.14) * 0.76;
					p.vy = (p.vy + (gy - p.y) * 0.14) * 0.76;
					p.x += p.vx;
					p.y += p.vy;
					ctx.fillStyle = p.c;
					ctx.fillRect(p.x, p.y, p.s, p.s);
					continue;
				}
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
			fly: () => {
				if (!reduce) flightStart = performance.now();
			},
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
	}, [colors.join(), hexColor, scale, gap, interactive, reduce, dot]);

	useEffect(() => {
		if (flyKey) api.current?.fly();
	}, [flyKey]);

	useEffect(() => {
		if (!burstKey) return;
		const { cx, cy } = placeRef.current?.(canvasRef.current!.clientWidth, canvasRef.current!.clientHeight) ?? {
			cx: canvasRef.current!.clientWidth / 2,
			cy: canvasRef.current!.clientHeight / 2,
		};
		api.current?.burst(cx, cy, 160);
	}, [burstKey]);

	return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden />;
};
