import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import dashboardFull from "../../assets/screenshots/synqit-dashboard-full.jpg";
import dashboardThumb from "../../assets/screenshots/synqit-dashboard-thumb.jpg";
import landingFull from "../../assets/screenshots/synqit-landing-full.jpg";
import landingThumb from "../../assets/screenshots/synqit-landing-thumb.jpg";
import sharedListFull from "../../assets/screenshots/synqit-shared-list-full.jpg";
import sharedListThumb from "../../assets/screenshots/synqit-shared-list-thumb.jpg";

export interface RoleShot {
	thumb: string;
	full: string;
	caption: string;
}

export const ROLE_SHOTS: Record<string, RoleShot[]> = {
	synqit: [
		{ thumb: landingThumb, full: landingFull, caption: "synqit.fr" },
		{
			thumb: dashboardThumb,
			full: dashboardFull,
			caption: "app.synqit.fr — dashboard",
		},
		{
			thumb: sharedListThumb,
			full: sharedListFull,
			caption: "app.synqit.fr — playlist",
		},
	],
};

/**
 * Each window is tilted on the same axis and stepped up along a
 * bottom-left -> top-right diagonal, echoing the intro's split.
 * On hover the window straightens and lifts out of the wall.
 */
const WINDOW_POSE = [
	"[transform:rotateY(-15deg)_translateY(30px)] hover:[transform:rotateY(-5deg)_translateY(20px)]",
	"[transform:rotateY(-15deg)_translateY(0px)] hover:[transform:rotateY(-5deg)_translateY(-10px)]",
	"[transform:rotateY(-15deg)_translateY(-30px)] hover:[transform:rotateY(-5deg)_translateY(-40px)]",
];

const RoleShots = ({ shots, label }: { shots: RoleShot[]; label: string }) => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const isOpen = openIndex !== null;

	const close = useCallback(() => setOpenIndex(null), []);
	const step = useCallback(
		(direction: number) =>
			setOpenIndex((current) =>
				current === null
					? current
					: (current + direction + shots.length) % shots.length,
			),
		[shots.length],
	);

	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") close();
			if (event.key === "ArrowRight") step(1);
			if (event.key === "ArrowLeft") step(-1);
		};
		window.addEventListener("keydown", onKeyDown);
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen, close, step]);

	if (shots.length === 0) return null;

	return (
		<div className='mt-9'>
			{/* Desktop: a wall of floating windows drifting off the right edge */}
			<div
				className='hidden w-[138%] lg:block'
				style={{ perspective: "1800px" }}>
				<div className='flex items-center gap-6'>
					{shots.map((shot, index) => (
						<motion.div
							key={shot.thumb}
							className='min-w-0 flex-1'
							initial={{ opacity: 0, y: 26 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-40px" }}
							transition={{
								duration: 0.55,
								ease: "easeOut",
								delay: index * 0.09,
							}}>
							<button
								type='button'
								onClick={() => setOpenIndex(index)}
								aria-label={`${label} — ${shot.caption}`}
								className={`block w-full cursor-pointer transition-transform duration-500 ease-out ${WINDOW_POSE[index]}`}>
								<span className='block overflow-hidden rounded-xl bg-white shadow-[0_18px_44px_rgba(16,22,34,0.22)] ring-1 ring-black/[0.08]'>
									<img
										src={shot.thumb}
										alt={shot.caption}
										className='block w-full'
									/>
								</span>
							</button>
						</motion.div>
					))}
				</div>
			</div>

			{/* Mobile / tablet: edge-to-edge snap filmstrip */}
			<div className='-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 [scrollbar-width:none] md:-mx-10 md:px-10 lg:hidden [&::-webkit-scrollbar]:hidden'>
				{shots.map((shot, index) => (
					<button
						key={shot.thumb}
						type='button'
						onClick={() => setOpenIndex(index)}
						aria-label={`${label} — ${shot.caption}`}
						className='w-[78vw] shrink-0 cursor-pointer snap-center sm:w-[62vw]'>
						<span className='block overflow-hidden rounded-xl bg-white shadow-[0_10px_26px_rgba(16,22,34,0.16)] ring-1 ring-black/[0.08]'>
							<img
								src={shot.thumb}
								alt={shot.caption}
								className='block w-full'
							/>
						</span>
					</button>
				))}
			</div>

			{createPortal(
				<AnimatePresence>
					{isOpen && (
						<motion.div
							className='fixed inset-0 z-13000 flex items-center justify-center bg-[rgba(16,22,34,0.9)] p-4 md:p-10'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							onClick={close}
							role='dialog'
							aria-modal='true'
							aria-label={`${label} screenshots`}>
							<button
								type='button'
								onClick={close}
								aria-label='Close'
								className='absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center text-white/80 transition-colors duration-200 hover:text-white md:right-8 md:top-8'>
								<FiX className='h-6 w-6' />
							</button>

							{shots.length > 1 && (
								<>
									<button
										type='button'
										aria-label='Previous'
										onClick={(event) => {
											event.stopPropagation();
											step(-1);
										}}
										className='absolute left-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center text-white/70 transition-colors duration-200 hover:text-white md:left-6'>
										<FiChevronLeft className='h-7 w-7' />
									</button>
									<button
										type='button'
										aria-label='Next'
										onClick={(event) => {
											event.stopPropagation();
											step(1);
										}}
										className='absolute right-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center text-white/70 transition-colors duration-200 hover:text-white md:right-6'>
										<FiChevronRight className='h-7 w-7' />
									</button>
								</>
							)}

							<motion.img
								key={shots[openIndex].full}
								src={shots[openIndex].full}
								alt={shots[openIndex].caption}
								onClick={(event) => event.stopPropagation()}
								className='max-h-full max-w-full rounded-lg object-contain shadow-[0_24px_70px_rgba(0,0,0,0.55)]'
								initial={{ opacity: 0, scale: 0.97 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.25, ease: "easeOut" }}
							/>

							<p className='absolute bottom-5 left-1/2 -translate-x-1/2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-white/70'>
								{shots[openIndex].caption}
								{shots.length > 1 && (
									<span className='ml-3 text-white/45'>
										{openIndex + 1}/{shots.length}
									</span>
								)}
							</p>
						</motion.div>
					)}
				</AnimatePresence>,
				document.body,
			)}
		</div>
	);
};

export default RoleShots;
