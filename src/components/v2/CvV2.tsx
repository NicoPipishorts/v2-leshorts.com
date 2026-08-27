import { motion } from "framer-motion";
import type { TFunction } from "i18next";
import type { ReactNode } from "react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	FiArrowDown,
	FiArrowUpRight,
	FiExternalLink,
	FiGithub,
	FiLinkedin,
	FiMail,
} from "react-icons/fi";
import meImage from "../../assets/images/me.png";
import V2Intro from "./V2Intro";

type V2RoleKey =
	| "synqit"
	| "kaast"
	| "intercloud"
	| "freelance"
	| "apple"
	| "soudesecoles";

const ROLE_KEYS: V2RoleKey[] = [
	"synqit",
	"kaast",
	"intercloud",
	"freelance",
	"apple",
	"soudesecoles",
];

const ROLE_LINKS: Partial<Record<V2RoleKey, string>> = {
	synqit: "https://synqit.fr",
	kaast: "https://kaa.st",
};

const SECTION_IDS = [
	"profil",
	"points-forts",
	"parcours",
	"competences",
	"education",
	"contact",
] as const;

const SKILL_GROUPS: { labelKey: string; items: string[] }[] = [
	{
		labelKey: "experience.skillGroups.frontend",
		items: [
			"React",
			"React Native",
			"TypeScript",
			"JavaScript",
			"GraphQL",
			"REST API",
			"TailwindCSS",
			"TanStack Query",
			"Accessibility",
			"Vite",
		],
	},
	{
		labelKey: "experience.skillGroups.backend",
		items: ["Node.js", "Strapi", "Prisma", "Sequelize"],
	},
	{
		labelKey: "experience.skillGroups.dataInfra",
		items: ["PostgreSQL", "Redis", "Docker"],
	},
	{
		labelKey: "experience.skillGroups.delivery",
		items: ["GitHub", "GitLab", "CI/CD", "Code Review"],
	},
	{
		labelKey: "experience.skillGroups.agentic",
		items: ["Claude Code", "Codex", "Prompt Engineering"],
	},
];

interface V2Project {
	name: string;
	summary: string;
	link?: string;
}

interface V2Role {
	key: V2RoleKey;
	title: string;
	company: string;
	period: string;
	summary: string;
	bullets: string[];
	ownership: string[];
	link?: string;
	projects?: V2Project[];
}

interface HeroRows {
	row1Prefix: string;
	row1Items: string[];
	row2Prefix: string;
	row2Items: string[];
	row3Prefix: string;
	row3Items: string[];
	row3Join: string;
}

const getDomainLabel = (link: string) => {
	try {
		return new URL(link).hostname.replace(/^www\./i, "");
	} catch {
		return link
			.replace(/^https?:\/\//i, "")
			.replace(/^www\./i, "")
			.split("/")[0];
	}
};

const buildRoles = (t: TFunction): V2Role[] =>
	ROLE_KEYS.map((key) => {
		const rolePath = `experience.roles.${key}`;
		const projects =
			key === "freelance"
				? (
						t(`${rolePath}.projects`, {
							returnObjects: true,
							defaultValue: [],
						}) as V2Project[]
					).map((project) => ({
						name: project.name,
						summary: project.summary,
						link: project.link,
					}))
				: undefined;

		return {
			key,
			title: t(`${rolePath}.title`),
			company: t(`${rolePath}.company`),
			period: t(`${rolePath}.period`),
			summary: t(`${rolePath}.summary`),
			bullets: ["point1", "point2"]
				.map((pointKey) => t(`${rolePath}.${pointKey}`))
				.filter((point) => point.trim().length > 0),
			ownership: t(`${rolePath}.ownership`, {
				returnObjects: true,
				defaultValue: [],
			}) as string[],
			link: ROLE_LINKS[key],
			projects,
		};
	});

const fadeUp = (delay = 0) => ({
	initial: { opacity: 0, y: 20 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, margin: "-40px" },
	transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

const Section = ({
	id,
	label,
	children,
}: {
	id: string;
	label: string;
	children: ReactNode;
}) => (
	<section id={id} className='mt-24 scroll-mt-28 first:mt-0 lg:mt-28'>
		<motion.p
			className='text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-brand-secondary'
			{...fadeUp()}>
			{label}
		</motion.p>
		<div className='mt-7'>{children}</div>
	</section>
);

const CtaButton = ({ link, small }: { link: string; small?: boolean }) => (
	<a
		href={link}
		target='_blank'
		rel='noreferrer'
		className={`cta-external inline-flex items-center rounded-none bg-brand-primary font-semibold tracking-[0.01em] text-white transition-colors duration-200 hover:bg-(--color-primary-dark) ${
			small ? "px-2.5 py-0.5 text-[0.72rem]" : "px-3 py-1 text-[0.76rem]"
		}`}>
		<FiExternalLink
			className={`mr-1.5 shrink-0 ${small ? "h-3 w-3" : "h-3.5 w-3.5"}`}
		/>
		{getDomainLabel(link)}
	</a>
);

const IdentityRow = ({
	prefix,
	items,
	join,
}: {
	prefix: string;
	items: string[];
	join?: string;
}) => (
	<p className='flex flex-wrap items-center gap-x-2 gap-y-2 text-[1rem] leading-[1.7]'>
		<span className='font-semibold text-(--color-text)'>{prefix}</span>
		{items.map((item, index) => (
			<Fragment key={item}>
				{index > 0 && (
					<span className='text-(--color-text-light)'>
						{join && index === items.length - 1 ? join : ","}
					</span>
				)}
				<span className='inline-flex bg-white/70 px-2.5 py-0.5 font-medium text-(--color-text) shadow-[0_1px_2px_rgba(16,22,34,0.04)]'>
					{item}
				</span>
			</Fragment>
		))}
	</p>
);

const useActiveSection = () => {
	const [activeSection, setActiveSection] = useState<string>(SECTION_IDS[0]);

	useEffect(() => {
		const updateActiveSection = () => {
			const marker = window.innerHeight * 0.4;
			let current: string = SECTION_IDS[0];
			for (const id of SECTION_IDS) {
				const element = document.getElementById(id);
				if (element && element.getBoundingClientRect().top <= marker) {
					current = id;
				}
			}
			const atPageBottom =
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 2;
			if (atPageBottom) {
				current = SECTION_IDS[SECTION_IDS.length - 1];
			}
			setActiveSection(current);
		};
		updateActiveSection();
		window.addEventListener("scroll", updateActiveSection, { passive: true });
		window.addEventListener("resize", updateActiveSection, { passive: true });
		return () => {
			window.removeEventListener("scroll", updateActiveSection);
			window.removeEventListener("resize", updateActiveSection);
		};
	}, []);

	return activeSection;
};

const CvV2 = () => {
	const { t, i18n } = useTranslation();
	const currentLanguage =
		i18n.resolvedLanguage?.startsWith("fr") || i18n.language?.startsWith("fr")
			? "fr"
			: "en";
	const activeSection = useActiveSection();

	const roles = buildRoles(t);
	const heroRows = t("about.heroRows", { returnObjects: true }) as HeroRows;
	const highlights = (
		t("about.highlights", { returnObjects: true }) as string[]
	).filter((item) => item.trim().length > 0);
	const softSkillGroups = t("about.softSkills.groups", {
		returnObjects: true,
	}) as { title: string; bullets: string[] }[];
	const educationEntries = t("about.education.entries", {
		returnObjects: true,
	}) as { title: string; institution: string; period: string }[];
	const hobbies = Object.entries(
		t("about.hobbies", { returnObjects: true }) as Record<string, string>,
	)
		.sort(
			([a], [b]) =>
				(Number.parseInt(a.replace(/\D/g, ""), 10) || 0) -
				(Number.parseInt(b.replace(/\D/g, ""), 10) || 0),
		)
		.map(([, value]) => value)
		.filter((value) => value.trim().length > 0);

	const email = ["me", "nicolaspisar.com"].join("@");

	const navItems = [
		{ id: "profil", label: t("about.title") },
		{ id: "points-forts", label: t("about.highlightsTitle") },
		{ id: "parcours", label: t("experience.rolesTitle") },
		{ id: "competences", label: t("about.skillsTitle") },
		{ id: "education", label: t("about.education.title") },
		{ id: "contact", label: "Contact" },
	];

	return (
		<motion.div
			className='page relative min-h-screen pt-24 md:pt-28'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.45 }}>
			<V2Intro />
			{/* Above-the-fold hero */}
			<section className='relative overflow-hidden'>
				{/* Faded backdrop portrait on small screens */}
				<motion.img
					src={meImage}
					alt=''
					aria-hidden='true'
					className='pointer-events-none absolute -right-[28%] bottom-0 z-0 h-[78%] w-auto max-w-none object-contain opacity-[0.13] lg:hidden'
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.13 }}
					transition={{ duration: 0.9, ease: "easeOut" }}
				/>

				{/* Big portrait — bottom-anchored, bleeding ~20% off the right edge */}
				<motion.div
					className='pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[60vw] items-end justify-end lg:flex'
					initial={{ opacity: 0, x: 28 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
					<div className='absolute right-[2%] top-[6%] h-[46vw] w-[46vw] max-h-195 max-w-195 rounded-full bg-[radial-gradient(circle,rgba(39,59,78,0.52)_0%,rgba(39,59,78,0.34)_40%,rgba(39,59,78,0.08)_62%,rgba(39,59,78,0)_78%)] blur-[70px]' />
					<img
						src={meImage}
						alt='Nicolas Pisar'
						className='relative z-10 h-[86vh] w-auto max-w-none translate-x-[20%] object-contain object-bottom'
					/>
				</motion.div>

				<div className='relative z-10 mx-auto max-w-6xl px-6 md:px-10'>
					<div className='grid items-center gap-8 lg:min-h-[86vh] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12'>
						<motion.div
							initial={{ opacity: 0, x: -24 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
							<p className='text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-brand-secondary'>
								{t("about.title")}
							</p>
							<h1 className='mt-4 font-display text-[clamp(2.6rem,6vw,4rem)] leading-[0.98] text-(--color-text)'>
								Nicolas Pisar
							</h1>
							<p className='mt-4 text-[clamp(1.15rem,2.2vw,1.5rem)] font-semibold text-brand-primary'>
								{t("about.heroHeading")}
							</p>
							<p className='mt-4 max-w-[46ch] text-[1rem] leading-[1.65] text-(--color-text-light)'>
								{t("about.heroSubheading")}
							</p>

							<div className='mt-8 space-y-3'>
								<IdentityRow
									prefix={heroRows.row1Prefix}
									items={heroRows.row1Items}
								/>
								<IdentityRow
									prefix={heroRows.row2Prefix}
									items={heroRows.row2Items}
								/>
								<IdentityRow
									prefix={heroRows.row3Prefix}
									items={heroRows.row3Items}
									join={heroRows.row3Join}
								/>
							</div>

							<a
								href={`/api/cv-pdf?lang=${currentLanguage}`}
								className='group mt-10 inline-flex items-center gap-2 rounded-none bg-brand-primary px-4 py-2 text-[0.84rem] font-semibold tracking-[0.01em] text-white transition-colors duration-200 hover:bg-(--color-primary-dark)'>
								<FiArrowDown className='h-4 w-4 shrink-0 transition-transform duration-250 group-hover:translate-y-0.5' />
								{t("about.downloadCvCta")}
							</a>
						</motion.div>

						<div className='hidden lg:block' />
					</div>
				</div>

				{/* Hairline + soft shadow at the exact bottom of the portrait */}
				<div
					className='pointer-events-none absolute bottom-0 left-0 h-px w-full mix-blend-multiply'
					style={{
						background:
							"linear-gradient(90deg, rgba(57,83,106,0.14) 0%, rgba(40,62,84,0.34) 52%, rgba(48,72,94,0.24) 100%)",
					}}
				/>
				<div
					className='pointer-events-none absolute -bottom-5 left-1/2 h-12 w-1/2 blur-[14px]'
					style={{
						background:
							"linear-gradient(90deg, rgba(18,29,42,0) 0%, rgba(18,29,42,0.2) 44%, rgba(18,29,42,0.34) 100%)",
					}}
				/>
			</section>

			<div className='mx-auto max-w-6xl px-6 pb-28 pt-20 md:px-10 md:pt-28'>
				<div className='lg:grid lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-24'>
					{/* Sticky rail */}
					<aside className='lg:sticky lg:top-28 lg:h-fit lg:self-start'>
						<p className='font-display text-[1.6rem] leading-none text-(--color-text)'>
							Nicolas Pisar
						</p>
						<p className='mt-2 text-[0.9rem] font-semibold text-brand-primary'>
							{t("about.heroHeading")}
						</p>

						<nav className='mt-12 hidden lg:block'>
							<ul className='list-none space-y-3'>
								{navItems.map((item) => {
									const isActive = activeSection === item.id;
									return (
										<li key={item.id}>
											<a
												href={`#${item.id}`}
												className={`group inline-flex items-center gap-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
													isActive
														? "text-(--color-text)"
														: "text-(--color-text-light) hover:text-(--color-text)"
												}`}>
												<span
													className={`h-px transition-all duration-300 ${
														isActive
															? "w-10 bg-brand-primary"
															: "w-6 bg-(--color-border) group-hover:w-10 group-hover:bg-brand-secondary"
													}`}
												/>
												{item.label}
											</a>
										</li>
									);
								})}
							</ul>
						</nav>

						<a
							href={`/api/cv-pdf?lang=${currentLanguage}`}
							className='group mt-12 inline-flex items-center gap-2 rounded-none bg-brand-primary px-4 py-2 text-[0.84rem] font-semibold tracking-[0.01em] text-white transition-colors duration-200 hover:bg-(--color-primary-dark)'>
							<FiArrowDown className='h-4 w-4 shrink-0 transition-transform duration-250 group-hover:translate-y-0.5' />
							{t("about.downloadCvCta")}
						</a>

						<div className='mt-10 flex items-center gap-5'>
							<a
								href='https://github.com/NicoPipishorts'
								target='_blank'
								rel='noreferrer'
								aria-label='GitHub'
								className='text-(--color-text-light) transition-all duration-200 hover:-translate-y-0.5 hover:text-brand-primary'>
								<FiGithub className='h-5 w-5' />
							</a>
							<a
								href='https://www.linkedin.com/in/nicolaspisar/'
								target='_blank'
								rel='noreferrer'
								aria-label='LinkedIn'
								className='text-(--color-text-light) transition-all duration-200 hover:-translate-y-0.5 hover:text-brand-primary'>
								<FiLinkedin className='h-5 w-5' />
							</a>
							<a
								href={`mailto:${email}`}
								aria-label='Email'
								className='text-(--color-text-light) transition-all duration-200 hover:-translate-y-0.5 hover:text-brand-primary'>
								<FiMail className='h-5 w-5' />
							</a>
						</div>
					</aside>

					{/* Content column */}
					<div className='mt-20 lg:mt-0'>
						<Section id='profil' label={t("about.title")}>
							<motion.p
								className='max-w-[62ch] text-[1.18rem] leading-[1.75] text-(--color-text) md:text-[1.28rem]'
								{...fadeUp(0.08)}>
								{t("about.profileSummary")}
							</motion.p>
						</Section>

						<Section id='points-forts' label={t("about.highlightsTitle")}>
							<ul className='list-none divide-y divide-(--color-border)/60'>
								{highlights.map((item, index) => (
									<motion.li
										key={item}
										className='py-4 text-[0.98rem] leading-[1.65] text-(--color-text) first:pt-0 last:pb-0'
										{...fadeUp(index * 0.07)}>
										{item}
									</motion.li>
								))}
							</ul>
						</Section>

						<Section id='parcours' label={t("experience.rolesTitle")}>
							<div>
								{roles.map((role) => (
									<motion.article
										key={role.key}
										className='relative grid gap-2 py-9 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:from-(--color-border)/80 before:to-transparent first:pt-0 first:before:hidden md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-10'
										{...fadeUp()}>
										<p className='text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-brand-secondary md:pt-1'>
											{role.period}
										</p>
										<div>
											<div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
												<h3 className='text-[1.08rem] font-semibold text-(--color-text)'>
													{role.title}
												</h3>
												{role.link ? (
													<CtaButton link={role.link} />
												) : (
													<span className='text-[0.84rem] font-medium text-(--color-text-light)'>
														{role.company}
													</span>
												)}
											</div>
											<p className='mt-3 max-w-[64ch] text-[0.93rem] leading-[1.75] text-(--color-text-light)'>
												{role.summary}
											</p>
											{role.bullets.length > 0 && (
												<ul className='mt-4 list-none space-y-2.5'>
													{role.bullets.map((point) => (
														<li
															key={point}
															className='flex items-start gap-2.5 text-[0.88rem] leading-[1.68] text-(--color-text-light)'>
															<span className='mt-[0.46rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary' />
															<span>{point}</span>
														</li>
													))}
												</ul>
											)}
											{role.ownership.length > 0 && (
												<p className='mt-4 text-[0.84rem] leading-[1.6] text-brand-secondary'>
													{role.ownership.join(" · ")}
												</p>
											)}
											{role.projects && role.projects.length > 0 && (
												<ul className='mt-6 list-none space-y-5'>
													{role.projects.map((project, projectIndex) => (
														<motion.li
															key={project.name}
															{...fadeUp(projectIndex * 0.06)}>
															<div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
																<span className='text-[0.93rem] font-semibold text-(--color-text)'>
																	{project.name}
																</span>
																{project.link && (
																	<CtaButton link={project.link} small />
																)}
															</div>
															<p className='mt-1.5 max-w-[62ch] text-[0.88rem] leading-[1.7] text-(--color-text-light)'>
																{project.summary}
															</p>
														</motion.li>
													))}
												</ul>
											)}
										</div>
									</motion.article>
								))}
							</div>
						</Section>

						<Section id='competences' label={t("about.skillsTitle")}>
							<div className='grid gap-x-12 gap-y-9 sm:grid-cols-2'>
								{SKILL_GROUPS.map((group, index) => (
									<motion.div key={group.labelKey} {...fadeUp(index * 0.06)}>
										<p className='text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-(--color-text-light)'>
											{t(group.labelKey)}
										</p>
										<p className='mt-2.5 text-[0.95rem] leading-[1.75] text-(--color-text)'>
											{group.items.join(" · ")}
										</p>
									</motion.div>
								))}
								<motion.div {...fadeUp(SKILL_GROUPS.length * 0.06)}>
									<p className='text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-(--color-text-light)'>
										{t("about.softSkillsTitle")}
									</p>
									<p className='mt-2.5 text-[0.95rem] leading-[1.75] text-(--color-text)'>
										{softSkillGroups.map((group) => group.title).join(" · ")}
									</p>
								</motion.div>
							</div>
						</Section>

						<Section id='education' label={t("about.education.title")}>
							<ul className='list-none divide-y divide-(--color-border)/60'>
								{educationEntries.map((entry, index) => (
									<motion.li
										key={`${entry.title}-${entry.period}`}
										className='flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 first:pt-0 last:pb-0'
										{...fadeUp(index * 0.07)}>
										<div>
											<p className='text-[0.95rem] font-semibold text-(--color-text)'>
												{entry.title}
											</p>
											<p className='mt-0.5 text-[0.85rem] text-(--color-text-light)'>
												{entry.institution}
											</p>
										</div>
										<span className='text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-brand-secondary'>
											{entry.period}
										</span>
									</motion.li>
								))}
							</ul>
							<motion.div className='mt-12' {...fadeUp(0.1)}>
								<p className='text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-brand-secondary'>
									{t("about.hobbiesTitle")}
								</p>
								<p className='mt-4 max-w-[62ch] text-[0.95rem] leading-[1.75] text-(--color-text-light)'>
									{hobbies.join(" · ")}
								</p>
							</motion.div>
						</Section>

						<Section id='contact' label='Contact'>
							<motion.div {...fadeUp(0.06)}>
								<a
									href={`mailto:${email}`}
									className='group inline-flex items-baseline gap-3 font-display text-[1.9rem] leading-[1.2] text-(--color-text) transition-colors duration-200 hover:text-brand-primary md:text-[2.3rem]'>
									{email}
									<FiArrowUpRight className='h-6 w-6 shrink-0 self-center transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1' />
								</a>
								<p className='mt-5 max-w-[56ch] text-[0.93rem] leading-[1.7] text-(--color-text-light)'>
									{t("about.heroSubheading")}
								</p>
							</motion.div>
						</Section>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default CvV2;
