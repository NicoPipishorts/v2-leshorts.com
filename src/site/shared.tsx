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
// "Message sent" flight, in two acts:
//  1. FOLD — dots peel off the logo at staggered moments and flock into a small paper plane that
//     recedes into the distance;
//  2. FLIGHT — the plane rides a lying "S" (up, then down) while coming towards the viewer, growing
//     until it leaves the screen. Then the dots stream back and rebuild the logo.
const STAGGER_MS = 450;
const PEEL_MS = 550;
const FOLD_MS = 1100;
const FLIGHT_MS = 2600;
const RETURN_AT = FOLD_MS + FLIGHT_MS + 150;
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const smooth = (t: number) => {
	const c = Math.min(1, Math.max(0, t));
	return c * c * (3 - 2 * c);
};

/**
 * The hexagon logo rebuilt from a few thousand particles: they fly in from
 * everywhere, the cursor pushes them around, a click detonates them.
 * `burstKey` changes → explode from the centre.
 * `flyKey` changes → the dots flock into a paper plane that recedes, then rides a lying S
 * towards the viewer and out of the screen, then flow back into the logo (contact form "sent").
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
		// visible slice of the canvas when the flight starts, so it always happens on screen
		let view = { top: 0, height: 0 };

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
			// plane centre, size (relative to the logo) and fade for a given flight time
			const vh = view.height || h;
			const farW = Math.min(150, Math.max(64, 0.16 * Math.min(w, vh))); // plane width once it has receded
			const scFar = farW / (home.size || 1);
			const A = { x: Math.min(home.cx, w * 0.72), y: Math.min(Math.max(home.cy - 0.06 * vh, view.top + 0.22 * vh), view.top + 0.45 * vh) };
			const planeAt = (ms: number) => {
				if (ms < FOLD_MS) {
					// act 1: glide from the logo to A while shrinking into the distance
					const t = easeInOutSine(ms / FOLD_MS);
					return { x: home.cx + (A.x - home.cx) * t, y: home.cy + (A.y - home.cy) * t, sc: 1 + (scFar - 1) * t, a: 1 };
				}
				// act 2: lying S — rise, dip, and drift down while approaching (growing) until off-screen
				const t = Math.min(1, (ms - FOLD_MS) / FLIGHT_MS);
				const e = easeInOutSine(t);
				return {
					x: A.x + (w * 0.3 - A.x) * e,
					y: A.y - 0.17 * vh * Math.sin(2 * Math.PI * t) + 0.6 * vh * t * t,
					sc: scFar * (1 + 11 * t ** 2.3),
					a: 1 - smooth((t - 0.86) / 0.14),
				};
			};
			const P = fl >= 0 ? planeAt(fl) : null;
			const Pn = fl >= 0 ? planeAt(fl + 16) : null; // a frame ahead → heading
			const hdx = P && Pn ? Pn.x - P.x : 1;
			const hdy = P && Pn ? Pn.y - P.y : 0;
			// a gentle roll through the S so the plane feels 3D, not a flat sticker
			const roll = fl >= FOLD_MS ? 0.72 + 0.28 * Math.cos(2 * Math.PI * ((fl - FOLD_MS) / FLIGHT_MS)) : 1;

			const soft = now < softUntil;
			const k = soft ? 0.014 : 0.11;
			const damp = soft ? 0.9 : 0.74;
			for (const p of parts) {
				const f = fl >= 0 ? smooth((fl - p.d) / PEEL_MS) : 0; // how far this dot has left the logo
				if (P && fl >= FOLD_MS + FLIGHT_MS) continue; // plane has left the screen
				if (P && f > 0) {
					const len = Math.hypot(hdx, hdy) || 1;
					// nose follows the heading; heading left, mirror the plane instead of flying it upside down
					const left = hdx < 0;
					// pitch at ~45% of the real heading so it glides (nose near the horizon) instead of diving
					const ang = Math.atan2(hdy * 0.45, hdx) - (left ? Math.PI - PLANE_ANGLE : PLANE_ANGLE);
					const rx = (left ? -p.px : p.px) * P.sc;
					const ry = p.py * P.sc * roll;
					const bx = P.x;
					const by = P.y;
					const dx = hdx;
					const dy = hdy;
					const cos = Math.cos(ang);
					const sin = Math.sin(ang);
					let gx = bx + rx * cos - ry * sin;
					let gy = by + rx * sin + ry * cos;
					// flock wobble across the path: loose while peeling off, calm once the plane has formed
					const wob = 60 * (1 - smooth(fl / (STAGGER_MS + PEEL_MS + 250))) * Math.sin(fl / 110 + p.ph);
					gx += (-dy / len) * wob;
					gy += (dx / len) * wob;
					// ease out of the logo instead of jumping
					gx = p.tx + (gx - p.tx) * f;
					gy = p.ty + (gy - p.ty) * f;
					// loose while flocking, tight once it is a plane so the shape holds at speed
					const kk = fl < FOLD_MS ? 0.12 : 0.3;
					p.vx = (p.vx + (gx - p.x) * kk) * 0.72;
					p.vy = (p.vy + (gy - p.y) * kk) * 0.72;
					p.x += p.vx;
					p.y += p.vy;
					// perspective: dots grow with the plane so it stays solid as it comes at us
					const ds = p.s * Math.max(0.55, Math.min(P.sc, 6) ** 0.85);
					ctx.globalAlpha = P.a;
					ctx.fillStyle = p.c;
					ctx.fillRect(p.x - ds / 2, p.y - ds / 2, ds, ds);
					ctx.globalAlpha = 1;
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
				if (reduce) return;
				const r = canvas.getBoundingClientRect();
				const k = h / (r.height || 1);
				view = { top: Math.max(0, -r.top * k), height: window.innerHeight * k };
				flightStart = performance.now();
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
