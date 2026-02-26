import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutGroup, motion } from "framer-motion";
import {
	useEffect,
	useRef,
	useState,
	type CSSProperties,
	type FocusEvent,
	type MouseEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "./Logo";

interface NavigationProps {
	mobileMenuOpen: boolean;
	onToggleMobileMenu: () => void;
	onCloseMobileMenu: () => void;
}

type NavTo = "/" | "/about" | "/experience" | "/portfolio" | "/contact";

const Navigation = ({
	mobileMenuOpen,
	onToggleMobileMenu,
	onCloseMobileMenu,
}: NavigationProps) => {
	const CTA_SWEEP_DURATION_MS = 620;
	const POST_SWEEP_DELAY_MS = 240;
	const DRAWER_CLOSE_DURATION_MS = 420;

	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const [closingTarget, setClosingTarget] = useState<NavTo | null>(null);
	const [reversingTarget, setReversingTarget] = useState<NavTo | null>(null);
	const [closingSweepColor, setClosingSweepColor] = useState<string | null>(
		null,
	);
	const [closingTextShift, setClosingTextShift] = useState<number>(0);
	const [reversingTextShift, setReversingTextShift] = useState<number>(0);
	const [hoveredDesktopNav, setHoveredDesktopNav] = useState<NavTo | null>(null);
	const closeTimeoutRef = useRef<number | null>(null);
	const resetTimeoutRef = useRef<number | null>(null);

	const navItems: Array<{ to: NavTo; label: string }> = [
		{ to: "/", label: t("nav.home") },
		{ to: "/about", label: t("nav.about") },
		{ to: "/experience", label: t("nav.experience") },
		{ to: "/portfolio", label: t("nav.portfolio") },
		{ to: "/contact", label: t("nav.contact") },
	];

	const toggleLanguage = () => {
		const newLang = i18n.language === "en" ? "fr" : "en";
		i18n.changeLanguage(newLang);
	};

	const closeMenuNow = () => {
		if (closeTimeoutRef.current !== null) {
			window.clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = null;
		}
		if (resetTimeoutRef.current !== null) {
			window.clearTimeout(resetTimeoutRef.current);
			resetTimeoutRef.current = null;
		}

		setClosingTarget(null);
		setReversingTarget(null);
		setClosingSweepColor(null);
		setClosingTextShift(0);
		setReversingTextShift(0);
		onCloseMobileMenu();
	};

	const getRandomSweep = () => {
		const palette = ["#DC5C48", "#488B9B", "#B79A77"];
		return palette[Math.floor(Math.random() * palette.length)];
	};

	const isNavItemActive = (to: NavTo) => {
		if (to === "/") {
			return pathname === "/";
		}

		return pathname === to || pathname.startsWith(`${to}/`);
	};

	const activeNavTo =
		navItems.find((item) => isNavItemActive(item.to))?.to ?? null;

	const computeLinkShift = (linkElement: HTMLElement) => {
		const labelElement = linkElement.querySelector(
			".mobile-nav-link-label",
		) as HTMLElement | null;
		const linkStyles = window.getComputedStyle(linkElement);
		const paddingLeft = Number.parseFloat(linkStyles.paddingLeft) || 0;
		const paddingRight = Number.parseFloat(linkStyles.paddingRight) || 0;
		const availableWidth = linkElement.clientWidth - paddingLeft - paddingRight;
		const labelWidth = labelElement?.offsetWidth ?? 0;
		return Math.max(0, availableWidth - labelWidth);
	};

	const handleMobileLinkClick = (
		event: MouseEvent<HTMLAnchorElement>,
		to: NavTo,
	) => {
		event.preventDefault();

		if (closingTarget) {
			return;
		}

		const linkElement = event.currentTarget;
		const computedShift = computeLinkShift(linkElement);
		const nextSweepColor = getRandomSweep();

		if (activeNavTo && activeNavTo !== to) {
			const currentActiveLinkElement = document.querySelector(
				`.mobile-nav-link[data-nav-to="${activeNavTo}"]`,
			) as HTMLElement | null;
			if (currentActiveLinkElement) {
				setReversingTextShift(computeLinkShift(currentActiveLinkElement));
				setReversingTarget(activeNavTo);
			} else {
				setReversingTextShift(0);
				setReversingTarget(null);
			}
		} else {
			setReversingTextShift(0);
			setReversingTarget(null);
		}

		setClosingTextShift(computedShift);
		setClosingSweepColor(nextSweepColor);
		setClosingTarget(to);
		closeTimeoutRef.current = window.setTimeout(() => {
			navigate({ to });
			onCloseMobileMenu();

			resetTimeoutRef.current = window.setTimeout(() => {
				setClosingTarget(null);
				setReversingTarget(null);
				setClosingSweepColor(null);
				setClosingTextShift(0);
				setReversingTextShift(0);
				resetTimeoutRef.current = null;
			}, DRAWER_CLOSE_DURATION_MS);

			closeTimeoutRef.current = null;
		}, CTA_SWEEP_DURATION_MS + POST_SWEEP_DELAY_MS);
	};

	useEffect(() => {
		return () => {
			if (closeTimeoutRef.current !== null) {
				window.clearTimeout(closeTimeoutRef.current);
			}
			if (resetTimeoutRef.current !== null) {
				window.clearTimeout(resetTimeoutRef.current);
			}
		};
	}, []);

	return (
		<motion.nav
			className={`fixed left-0 right-0 top-0 z-1000 bg-transparent py-0 md:py-[0.85rem]${mobileMenuOpen ? " mobile-menu-open" : ""}`}
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.6, ease: "easeOut" }}>
				<div className='mt-0 mx-auto flex min-h-18 w-full items-center justify-between border-b border-white/15 bg-[rgba(9,13,22,0.66)] px-[0.6rem] py-[0.55rem] shadow-[0_6px_18px_rgba(0,0,0,0.18)] backdrop-blur-[6px] md:mt-3 md:w-[min(1080px,calc(100%-2rem))] md:rounded-full md:border md:border-white/20 md:bg-[rgba(9,13,22,0.5)] md:px-[1.15rem] md:py-2 md:shadow-[0_12px_35px_rgba(0,0,0,0.24)] md:backdrop-blur-[14px]'>
				<Link to='/' className='flex items-center' onClick={closeMenuNow}>
					<motion.div
						className='flex cursor-pointer items-center justify-center'
						whileHover={{ scale: 1.05, rotate: 5 }}
						transition={{ duration: 0.2 }}>
						<Logo className='h-11 w-11 text-white transition-all duration-300 md:h-13.75 md:w-13.75' />
					</motion.div>
				</Link>

				<div className='ml-auto flex items-center gap-[0.65rem] md:gap-8'>
						<LayoutGroup id='desktop-nav-pills'>
							<ul
								className='hidden list-none items-center gap-10 md:flex'
								onMouseLeave={() => setHoveredDesktopNav(null)}
								onBlur={(event: FocusEvent<HTMLUListElement>) => {
									const nextTarget = event.relatedTarget as Node | null;
									if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
										setHoveredDesktopNav(null);
									}
								}}>
								{navItems.map((item, index) => {
									const isActive = isNavItemActive(item.to);
									const isHovered = hoveredDesktopNav === item.to;

									return (
										<motion.li
											key={item.to}
											initial={{ y: -20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: index * 0.1, duration: 0.4 }}>
											<Link
												to={item.to}
												className={`relative inline-flex items-center justify-center overflow-hidden rounded-full px-4 py-2 font-bold transition-colors duration-200 ${
													isActive || isHovered ? "text-white" : "text-white/90"
												}`}
												onMouseEnter={() => setHoveredDesktopNav(item.to)}
												onFocus={() => setHoveredDesktopNav(item.to)}
												onClick={closeMenuNow}>
												{isHovered && (
													<motion.span
														layoutId='desktop-hover-pill'
														className='absolute inset-0 z-0 rounded-full bg-brand-secondary'
														transition={{
															type: "spring",
															stiffness: 420,
															damping: 32,
															mass: 0.75,
														}}
													/>
												)}
												{isActive && (
													<motion.span
														layoutId='desktop-active-pill'
														className='absolute inset-0 z-[1] rounded-full bg-brand-primary'
														transition={{
															type: "spring",
															stiffness: 440,
															damping: 34,
															mass: 0.8,
														}}
													/>
												)}
												<span className='relative z-[2]'>{item.label}</span>
											</Link>
										</motion.li>
									);
								})}
							</ul>
						</LayoutGroup>

					<motion.div
						className='relative flex h-8 w-18 cursor-pointer items-center rounded-[20px] border-2 border-white/25 bg-white/10 p-1 transition-all duration-300 hover:border-white/50 hover:shadow-[0_2px_8px_rgba(0,0,0,0.2)] md:h-9 md:w-20'
						onClick={toggleLanguage}
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.4 }}>
						<div className='relative z-2 flex w-full'>
							<span
								className={`flex-1 py-1 text-center text-[0.74rem] font-semibold transition-colors duration-300 md:text-[0.8rem] ${
									i18n.language === "en" ? "text-white" : "text-white/70"
								}`}>
								EN
							</span>
							<span
								className={`flex-1 py-1 text-center text-[0.74rem] font-semibold transition-colors duration-300 md:text-[0.8rem] ${
									i18n.language === "fr" ? "text-white" : "text-white/70"
								}`}>
								FR
							</span>
						</div>
						<motion.div
							className='absolute left-1 top-1 z-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-2xl bg-brand-primary shadow-[0_2px_4px_rgba(220,92,72,0.3)]'
							animate={{
								x: i18n.language === "en" ? 0 : "100%",
							}}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
						/>
					</motion.div>

					<button
						type='button'
						className={`relative h-9.5 w-9.5 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-all duration-300 md:hidden ${
							mobileMenuOpen ? "hidden" : "inline-flex"
						}`}
						onClick={onToggleMobileMenu}
						aria-label='Open navigation menu'
						aria-expanded={mobileMenuOpen}>
						<FiMenu className='h-[1.2rem] w-[1.2rem]' aria-hidden='true' />
					</button>
				</div>
			</div>

			<div
				className={`mobile-nav-drawer fixed right-0 top-0 z-900 h-screen w-[80vw] overflow-hidden border-l border-white/15 bg-[rgba(6,10,18,0.94)] px-5 pb-6 pt-[5.1rem] backdrop-blur-md transition-transform duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
					mobileMenuOpen ? "translate-x-0" : "translate-x-full"
				}${closingTarget ? " closing pointer-events-none" : ""}`}>
				<button
					type='button'
					className='absolute right-[0.8rem] top-[0.8rem] inline-flex h-9.5 w-9.5 items-center justify-center rounded-full border border-[rgba(220,92,72,0.85)] bg-[rgba(220,92,72,0.2)] text-white'
					onClick={closeMenuNow}
					aria-label='Close navigation menu'>
					<FiX className='h-[1.1rem] w-[1.1rem]' aria-hidden='true' />
				</button>

				<ul className='mobile-nav-links relative z-1 flex list-none flex-col gap-4'>
					{navItems.map((item) => (
						<li key={`mobile-${item.to}`}>
								<Link
									to={item.to}
									className={`mobile-nav-link relative flex items-center justify-start overflow-hidden border-b border-white/15 px-[0.2rem] py-[0.85rem] text-[1.15rem] font-bold text-white/90 [--cta-reverse-shift:0px] [--cta-sweep-color:rgba(220,92,72,0.86)] [--cta-text-shift:0px] ${
											isNavItemActive(item.to) ? " active" : ""
										}${closingTarget === item.to ? " exiting" : ""}${reversingTarget === item.to ? " reversing" : ""}`}
								onClick={(event) => handleMobileLinkClick(event, item.to)}
								data-nav-to={item.to}
								style={
									closingSweepColor &&
									(closingTarget === item.to || reversingTarget === item.to)
										? ({
												"--cta-sweep-color": closingSweepColor,
												"--cta-text-shift": `${closingTextShift}px`,
												"--cta-reverse-shift": `${reversingTextShift}px`,
											} as CSSProperties)
										: undefined
								}>
									<span className='mobile-nav-link-label relative z-1 inline-block'>
										{item.label}
									</span>
								</Link>
						</li>
					))}
				</ul>
			</div>
		</motion.nav>
	);
};

export default Navigation;
