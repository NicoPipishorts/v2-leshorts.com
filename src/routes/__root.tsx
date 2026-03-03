import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/next";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../components/LoadingScreen";
import Logo from "../components/Logo";

const RootComponent = () => {
	const { i18n } = useTranslation();
	const [isLoading, setIsLoading] = useState(true);
	const [showContent, setShowContent] = useState(false);
	const [isMobileViewport, setIsMobileViewport] = useState(false);
	const [skipAnimation, setSkipAnimation] = useState(false);
	const logoControls = useAnimation();
	const contentFadeTimeoutRef = useRef<number | null>(null);

	useEffect(() => {
		const hasSeenLoading = sessionStorage.getItem("hasSeenLoading");
		if (hasSeenLoading) {
			setIsLoading(false);
			setShowContent(true);
			setSkipAnimation(true);
		}
	}, []);

	const currentLanguage =
		i18n.resolvedLanguage?.startsWith("fr") || i18n.language?.startsWith("fr")
			? "fr"
			: "en";

	const toggleLanguage = () => {
		i18n.changeLanguage(currentLanguage === "en" ? "fr" : "en");
	};

	const handleLoadingComplete = () => {
		sessionStorage.setItem("hasSeenLoading", "true");
		setIsLoading(false);

		// Animate logo to corner
		const mobile = window.matchMedia("(max-width: 767px)").matches;
		logoControls.start({
			top: mobile ? 12 : 16,
			left: mobile ? 12 : 20,
			width: mobile ? 62 : 82,
			height: mobile ? 62 : 82,
			x: 0,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 110,
				damping: 22,
				mass: 1,
			},
		});

		// Fade in site content while logo is mid-travel
		contentFadeTimeoutRef.current = window.setTimeout(() => {
			setShowContent(true);
			contentFadeTimeoutRef.current = null;
		}, 500);
	};

	useEffect(() => {
		return () => {
			if (contentFadeTimeoutRef.current !== null)
				window.clearTimeout(contentFadeTimeoutRef.current);
		};
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 767px)");
		const updateViewport = () => setIsMobileViewport(mediaQuery.matches);
		updateViewport();
		mediaQuery.addEventListener("change", updateViewport);
		return () => mediaQuery.removeEventListener("change", updateViewport);
	}, []);

	return (
		<>
			<AnimatePresence>
				{isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
			</AnimatePresence>

			{/* Logo: fixed center during load, springs to corner on complete */}
			{!skipAnimation && (
				<motion.div
					className='pointer-events-none fixed z-10001'
					aria-hidden='true'
					initial={{
						top: "50vh",
						left: "50vw",
						x: "-50%",
						y: "-50%",
						width: isMobileViewport ? "60vw" : "20vw",
						height: isMobileViewport ? "60vw" : "20vw",
					}}
					animate={logoControls}>
					<Logo
						className='h-full w-full text-brand-primary drop-shadow-[0_10px_24px_rgba(0,0,0,0.24)]'
						animateOnMount
						hoverEraseBorder={false}
					/>
				</motion.div>
			)}

			{/* Static logo for repeat visits */}
			{skipAnimation && (
				<div
					className='pointer-events-none absolute left-3 top-3 z-1100 md:left-5 md:top-4'
					aria-hidden='true'>
					<Logo
						className='h-[3.9rem] w-[3.9rem] text-brand-primary drop-shadow-[0_10px_24px_rgba(0,0,0,0.24)] md:h-[5.1rem] md:w-[5.1rem]'
						animateOnMount={false}
						hoverEraseBorder={!isMobileViewport}
					/>
				</div>
			)}

			{/* Site content fades in mid-travel */}
			<motion.div
				initial={skipAnimation ? false : { opacity: 0 }}
				animate={{ opacity: showContent ? 1 : 0 }}
				transition={{ duration: 0.7, ease: "easeOut" }}>
				{showContent && (
					<>
						<div className='absolute right-3 top-3 z-1100 md:right-5 md:top-4'>
							<button
								type='button'
								onClick={toggleLanguage}
								className='relative flex h-9 w-19 cursor-pointer items-center rounded-[20px] border-2 border-brand-primary/80 bg-transparent p-[0.36rem] text-(--color-text) transition-all duration-300 md:h-10 md:w-22'
								aria-label='Toggle language'>
								<div className='relative z-2 flex w-full'>
									<span
										className={`flex-1 py-1 text-center text-[0.74rem] font-semibold transition-colors duration-300 md:text-[0.8rem] ${
											currentLanguage === "en"
												? "text-white"
												: "text-(--color-text-light)"
										}`}>
										EN
									</span>
									<span
										className={`flex-1 py-1 text-center text-[0.74rem] font-semibold transition-colors duration-300 md:text-[0.8rem] ${
											currentLanguage === "fr"
												? "text-white"
												: "text-(--color-text-light)"
										}`}>
										FR
									</span>
								</div>
								<div
									className='absolute left-[0.36rem] top-[0.36rem] z-1 h-[calc(100%-0.72rem)] w-[calc(50%-0.36rem)] rounded-2xl bg-brand-primary shadow-[0_2px_4px_rgba(220,92,72,0.3)] transition-transform duration-250'
									style={{
										transform:
											currentLanguage === "en"
												? "translateX(0)"
												: "translateX(100%)",
									}}
								/>
							</button>
						</div>
						<main className='app-content'>
							<Outlet />
						</main>
					</>
				)}
			</motion.div>
			<Analytics />
		</>
	);
};

export const Route = createRootRoute({
	component: RootComponent,
});
