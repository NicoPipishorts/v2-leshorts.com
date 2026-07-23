import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "../Logo";

type Phase = "draw" | "split" | "done";

/**
 * Self-contained intro for the /v2 route:
 * 1. the logo draws itself in the centre (hexagon stroke + monogram fill),
 * 2. the beige cover splits along the bottom-left -> top-right diagonal,
 *    the two halves sliding apart while the logo rides the top half into
 *    its resting corner, revealing the page underneath.
 */
const V2Intro = () => {
	const [phase, setPhase] = useState<Phase>("draw");
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsMobile(window.matchMedia("(max-width: 767px)").matches);
	}, []);

	useEffect(() => {
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const hasSeenIntro = sessionStorage.getItem("hasSeenV2Intro");

		if (prefersReducedMotion || hasSeenIntro) {
			setPhase("done");
			return;
		}

		const splitTimer = window.setTimeout(() => setPhase("split"), 2000);
		const doneTimer = window.setTimeout(() => {
			sessionStorage.setItem("hasSeenV2Intro", "true");
			// Let the resting corner logo know it can appear now that the
			// travelling logo has arrived, so the two never show at once.
			window.dispatchEvent(new CustomEvent("v2-intro-done"));
			setPhase("done");
		}, 3200);
		return () => {
			window.clearTimeout(splitTimer);
			window.clearTimeout(doneTimer);
		};
	}, []);

	const bigLogo = isMobile ? "58vw" : "18vw";
	const logoRest = {
		top: isMobile ? 12 : 16,
		left: isMobile ? 12 : 20,
		x: "0%",
		y: "0%",
		width: isMobile ? 62 : 82,
		height: isMobile ? 62 : 82,
	};
	const logoCentre = {
		top: "50vh",
		left: "50vw",
		x: "-50%",
		y: "-50%",
		width: bigLogo,
		height: bigLogo,
	};

	const panelTransition = {
		duration: 0.95,
		ease: [0.76, 0, 0.24, 1] as const,
	};

	return (
		<AnimatePresence>
			{phase !== "done" && (
				<motion.div
					className='pointer-events-none fixed inset-0 z-12000'
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}>
					{/* Top-left half of the diagonal split */}
					<motion.div
						className='absolute inset-0 bg-(--color-background)'
						style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
						initial={{ x: 0, y: 0 }}
						animate={phase === "split" ? { x: "-100%", y: "-100%" } : { x: 0, y: 0 }}
						transition={panelTransition}
					/>
					{/* Bottom-right half of the diagonal split */}
					<motion.div
						className='absolute inset-0 bg-(--color-background)'
						style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
						initial={{ x: 0, y: 0 }}
						animate={phase === "split" ? { x: "100%", y: "100%" } : { x: 0, y: 0 }}
						transition={panelTransition}
					/>
					{/* Logo: draws centred, then rides the top half to its corner */}
					<motion.div
						className='fixed z-12001'
						initial={logoCentre}
						animate={phase === "split" ? logoRest : logoCentre}
						transition={{
							type: "spring",
							stiffness: 110,
							damping: 22,
							mass: 1,
						}}>
						<Logo
							className='h-full w-full text-brand-primary drop-shadow-[0_10px_24px_rgba(0,0,0,0.24)]'
							animateOnMount
							hoverEraseBorder={false}
						/>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default V2Intro;
