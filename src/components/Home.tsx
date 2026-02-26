import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import image1 from "../assets/images/home_page_1.jpg";
import image2 from "../assets/images/home_page_2.jpg";
import image3 from "../assets/images/home_page_3.jpg";
import image4 from "../assets/images/home_page_4.jpg";
import image5 from "../assets/images/home_page_5.jpg";
import image6 from "../assets/images/home_page_6.jpg";
import image7 from "../assets/images/home_page_7.jpg";
import AmbientGlows from "./AmbientGlows";

interface Section {
	image: string;
	title: string;
	description: string;
	accent: string;
}

const sections: Section[] = [
	{
		image: image1,
		title: "Creative Development",
		description: "Crafting digital experiences with precision and passion.",
		accent: "#DC5C48",
	},
	{
		image: image2,
		title: "Modern Design",
		description:
			"Building interfaces that are expressive, useful, and memorable.",
		accent: "#488B9B",
	},
	{
		image: image3,
		title: "Performance First",
		description:
			"Optimized architecture and smooth interactions at every layer.",
		accent: "#B79A77",
	},
	{
		image: image4,
		title: "User Experience",
		description: "Designing clear pathways that users understand instantly.",
		accent: "#DC5C48",
	},
	{
		image: image5,
		title: "Technical Excellence",
		description: "Clean implementation choices that scale over time.",
		accent: "#488B9B",
	},
	{
		image: image6,
		title: "Innovation",
		description: "Exploring fresh approaches with practical outcomes.",
		accent: "#B79A77",
	},
	{
		image: image7,
		title: "Collaboration",
		description: "Turning ideas into products through strong team execution.",
		accent: "#DC5C48",
	},
];

const Home = () => {
	const { t } = useTranslation();
	const panelClass =
		"relative mx-auto mb-0 h-[82vh] min-h-[82vh] w-screen overflow-visible rounded-none shadow-[0_16px_34px_rgba(9,24,38,0.18)] md:mb-[3.8rem] md:h-[86vh] md:min-h-[86vh] md:w-[80vw] md:overflow-visible md:rounded-[18px] md:shadow-[0_22px_46px_rgba(9,24,38,0.22)] lg:mb-[5rem] lg:h-[90vh] lg:min-h-[90vh] lg:w-[80vw] lg:rounded-[22px]";
	const imageClass =
		"block h-full w-full rounded-none object-cover md:rounded-[18px] lg:rounded-[22px]";
	const captionBaseClass =
		"absolute mx-3 mb-2 top-auto z-20 h-auto w-fit max-w-[min(86%,360px)] rounded-[8px] bg-[rgba(56,140,188,0.42)] px-[1.2rem] py-[0.7rem] text-white shadow-[0_18px_42px_rgba(12,68,99,0.42)] backdrop-blur-[10px] md:max-w-[min(82%,460px)] md:rounded-[18px] lg:max-w-[min(78%,520px)]";
	const captionLeftClass =
		"left-[0.35rem] bottom-[0.55rem] md:left-[1.1rem] md:bottom-[1.1rem] lg:left-[2rem] lg:bottom-[1.2rem]";
	const captionRightClass =
		"right-[0.35rem] bottom-[0.55rem] md:right-[1.1rem] md:bottom-[1.1rem] lg:right-[3rem] lg:bottom-[2.2rem]";

	return (
		<div className='relative isolate min-h-screen bg-[radial-gradient(circle_at_15%_12%,#f4f6f9_0%,#e7edf2_30%,#d8e0e8_100%)] text-[#162130]'>
			<AmbientGlows variant='home' sticky />

			<section className='relative z-10 flex min-h-screen items-center justify-center px-4 pb-14 pt-28 md:px-6 md:pb-16 md:pt-32'>
				<motion.div
					className='relative z-20 mx-auto w-[min(920px,100%)] text-center'
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}>
					<h1 className='mb-[0.8rem] text-balance text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] tracking-[-0.03em]'>
						{t("home.greeting")}{" "}
						<span className='text-brand-primary'>{t("home.name")}</span>
					</h1>
					<p className='mx-auto max-w-195 text-[clamp(1.1rem,2.6vw,1.6rem)] font-semibold text-[#24435a]'>
						{t("home.subtitle")}
					</p>
					<p className='mx-auto mt-5 max-w-175 text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.7] text-[#30475d]'>
						{t("home.description")}
					</p>

					<div className='mt-8 flex flex-col items-center justify-center gap-4 md:flex-row md:flex-wrap'>
						<Link
							to='/portfolio'
							className='inline-flex w-[min(320px,100%)] min-w-45 items-center justify-center rounded-full border-2 border-transparent bg-brand-primary px-[1.4rem] py-[0.95rem] text-[0.95rem] font-semibold text-white shadow-[0_10px_26px_rgba(220,92,72,0.3)] transition-all duration-300 hover:-translate-y-0.5 md:w-auto'>
							{t("home.viewWork")}
						</Link>
						<Link
							to='/contact'
							className='inline-flex w-[min(320px,100%)] min-w-[180px] items-center justify-center rounded-full border-2 border-[rgba(22,33,48,0.25)] bg-[rgba(255,255,255,0.55)] px-[1.4rem] py-[0.95rem] text-[0.95rem] font-semibold text-[#1d2d3f] transition-all duration-300 hover:bg-[rgba(255,255,255,0.8)] md:w-auto'>
							{t("home.getInTouch")}
						</Link>
					</div>
				</motion.div>
			</section>

			<section className='relative z-10 pb-0 md:pb-[5rem]'>
				{sections.map((section, index) => (
					<motion.article
						key={section.title}
						className={panelClass}
						style={{ zIndex: sections.length - index }}
						initial={{ opacity: 0, y: 32 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.55, ease: "easeOut" }}>
						<img
							className={imageClass}
							src={section.image}
							alt={section.title}
						/>

						<div
							className='pointer-events-none absolute inset-0 rounded-none md:rounded-[18px] lg:rounded-[22px]'
							style={{
								background: `linear-gradient(150deg, ${section.accent}75 0%, rgba(7, 12, 20, 0.1) 48%, rgba(7, 12, 20, 0.72) 100%)`,
							}}
						/>

						<div
							className={`${captionBaseClass} ${
								index % 2 === 0 ? captionLeftClass : captionRightClass
							}`}>
							<span className='text-[1.15rem] font-bold leading-[1.1] tracking-tight md:text-[clamp(1.1rem,1.7vw,1.45rem)]'>
								{section.title}
							</span>
						</div>
					</motion.article>
				))}
			</section>
		</div>
	);
};

export default Home;
