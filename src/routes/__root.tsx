import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../components/LoadingScreen";
import Logo from "../components/Logo";

const RootComponent = () => {
	const { i18n } = useTranslation();
	const [showLoader, setShowLoader] = useState(true);
	const [showContent, setShowContent] = useState(false);
	const [isMobileViewport, setIsMobileViewport] = useState(false);
	const hideLoaderTimeoutRef = useRef<number | null>(null);

	useEffect(() => {
		const hasSeenLoading = sessionStorage.getItem("hasSeenLoading");

		if (hasSeenLoading) {
			setShowLoader(false);
			setShowContent(true);
		}
	}, []);

	const toggleLanguage = () => {
		i18n.changeLanguage(i18n.language === "en" ? "fr" : "en");
	};

	const handleLoadingComplete = () => {
		sessionStorage.setItem("hasSeenLoading", "true");
		setShowContent(true);

		hideLoaderTimeoutRef.current = window.setTimeout(() => {
			setShowLoader(false);
			hideLoaderTimeoutRef.current = null;
		}, 900);
	};

	useEffect(() => {
		return () => {
			if (hideLoaderTimeoutRef.current !== null) {
				window.clearTimeout(hideLoaderTimeoutRef.current);
			}
			document.body.classList.remove("mobile-nav-open");
		};
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 767px)");
		const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

		updateViewport();
		mediaQuery.addEventListener("change", updateViewport);

		return () => {
			mediaQuery.removeEventListener("change", updateViewport);
		};
	}, []);

	return (
		<>
			<AnimatePresence>
				{showLoader && <LoadingScreen onComplete={handleLoadingComplete} />}
			</AnimatePresence>
			{showContent && (
				<>
					<div
						className='absolute left-3 top-3 z-[1100] flex items-center md:left-5 md:top-4'
						aria-hidden='true'>
						<Logo
							className='h-[3.9rem] w-[3.9rem] text-brand-primary drop-shadow-[0_10px_24px_rgba(0,0,0,0.24)] md:h-[5.1rem] md:w-[5.1rem]'
							animateOnMount={false}
							hoverEraseBorder={!isMobileViewport}
						/>
					</div>
					<div className='absolute right-3 top-3 z-[1100] md:right-5 md:top-4'>
						<button
							type='button'
							onClick={toggleLanguage}
							className='relative flex h-9 w-19 cursor-pointer items-center rounded-[20px] border-2 border-brand-primary/80 bg-transparent p-[0.36rem] text-(--color-text) transition-all duration-300 md:h-10 md:w-22'
							aria-label='Toggle language'>
							<div className='relative z-2 flex w-full'>
								<span
									className={`flex-1 py-1 text-center text-[0.74rem] font-semibold transition-colors duration-300 md:text-[0.8rem] ${
										i18n.language === "en"
											? "text-white"
											: "text-(--color-text-light)"
									}`}>
									EN
								</span>
								<span
									className={`flex-1 py-1 text-center text-[0.74rem] font-semibold transition-colors duration-300 md:text-[0.8rem] ${
										i18n.language === "fr"
											? "text-white"
											: "text-(--color-text-light)"
									}`}>
									FR
								</span>
							</div>
							<div
								className='absolute left-[0.36rem] top-[0.36rem] z-1 h-[calc(100%-0.72rem)] w-[calc(50%-0.36rem)] rounded-2xl bg-brand-primary shadow-[0_2px_4px_rgba(220,92,72,0.3)] transition-transform duration-250'
								style={{
									transform: i18n.language === "en" ? "translateX(0)" : "translateX(100%)",
								}}
							/>
						</button>
					</div>
					<main className='app-content'>
						<Outlet />
					</main>
				</>
			)}
		</>
	);
};

export const Route = createRootRoute({
	component: RootComponent,
});
