import { motion } from "framer-motion";
import type { TFunction } from "i18next";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { FiBriefcase, FiFolder, FiLayers, FiServer } from "react-icons/fi";
import {
	SiAmazonwebservices,
	SiApplemusic,
	SiCloudflare,
	SiDocker,
	SiGit,
	SiGooglecloud,
	SiJavascript,
	SiNodedotjs,
	SiPostgresql,
	SiPrisma,
	SiReact,
	SiReactquery,
	SiRedis,
	SiSass,
	SiSequelize,
	SiSpotify,
	SiStrapi,
	SiTailwindcss,
	SiTypescript,
	SiVite,
} from "react-icons/si";
import AmbientGlows from "./AmbientGlows";
import Contact from "./Contact";
import AboutEducation from "./about/AboutEducation";
import AboutHero from "./about/AboutHero";
import AboutHobbies from "./about/AboutHobbies";
import AboutIntro from "./about/AboutIntro";
import AboutSkills from "./about/AboutSkills";
import AboutSoftSkills from "./about/AboutSoftSkills";
import AboutTimeline from "./about/AboutTimeline";
import {
	type ArchitectureDiagramNode,
	type EducationEntry,
	type ExperienceProjectHighlight,
	type ExperienceRole,
	type SkillItem,
	type SkillGroup,
	type SoftSkillGroup,
} from "./about/types";

type RoleKey =
	| "synqit"
	| "kaast"
	| "freelance"
	| "intercloud"
	| "apple"
	| "soudesecoles";

interface FreelanceProjectTranslation {
	name: string;
	summary: string;
	point1: string;
	point2: string;
	point3: string;
	ownership?: string[];
	diagram?: ArchitectureDiagramNodeTranslation[];
	link?: string;
}

interface ArchitectureDiagramNodeTranslation {
	label: string;
	value: string;
}

interface SkillGroupConfig {
	key: SkillGroup["key"];
	titleKey: string;
	icon: IconType;
	skills: SkillGroup["skills"];
}

const ROLE_KEYS: RoleKey[] = [
	"synqit",
	"kaast",
	"freelance",
	"intercloud",
	"apple",
	"soudesecoles",
];

const ROLE_LINKS: Partial<Record<RoleKey, string[]>> = {
	synqit: ["https://synqit.fr"],
	kaast: ["https://kaa.st"],
};

const ROLE_TECHNOLOGIES: Partial<Record<RoleKey, SkillItem[]>> = {
	synqit: [
		{ name: "React", icon: SiReact },
		{ name: "TypeScript", icon: SiTypescript },
		{ name: "Node.js", icon: SiNodedotjs },
		{ name: "Prisma", icon: SiPrisma },
		{ name: "PostgreSQL", icon: SiPostgresql },
		{ name: "Spotify API", icon: SiSpotify },
		{ name: "Apple Music API", icon: SiApplemusic },
	],
	kaast: [
		{ name: "React", icon: SiReact },
		{ name: "SCSS", icon: SiSass },
		{ name: "TailwindCSS", icon: SiTailwindcss },
		{ name: "TanStack Query", icon: SiReactquery },
		{ name: "TanStack Router", icon: FiLayers },
		{ name: "Meilisearch", icon: FiServer },
		{ name: "Cloudflare Integration", icon: SiCloudflare },
		{ name: "Component Library", icon: FiFolder },
		{ name: "State & Cache Mgmt", icon: FiBriefcase },
	],
	intercloud: [
		{ name: "React", icon: SiReact },
		{ name: "Redux Toolkit", icon: FiLayers },
		{ name: "Component Library", icon: FiFolder },
		{ name: "SaaS Dashboard UI", icon: FiBriefcase },
		{ name: "Server-Sent Events", icon: FiServer },
		{ name: "Meilisearch", icon: FiServer },
		{ name: "Elasticsearch", icon: FiServer },
		{ name: "State & Cache Mgmt", icon: FiBriefcase },
	],
};

const FREELANCE_PROJECT_TECHNOLOGIES: Record<string, SkillItem[]> = {
	"https://comacademy.fr/": [
		{ name: "React Native", icon: SiReact },
		{ name: "Node.js", icon: SiNodedotjs },
		{ name: "Express.js", icon: SiNodedotjs },
		{ name: "Strapi", icon: SiStrapi },
		{ name: "API Design", icon: FiServer },
		{ name: "Back Office", icon: FiFolder },
	],
	"https://soulbm.fr": [
		{ name: "React", icon: SiReact },
		{ name: "TanStack Query", icon: SiReactquery },
		{ name: "Node.js", icon: SiNodedotjs },
		{ name: "Strapi", icon: SiStrapi },
		{ name: "PostgreSQL", icon: SiPostgresql },
		{ name: "Docker", icon: SiDocker },
		{ name: "API Design", icon: FiServer },
		{ name: "Back Office", icon: FiFolder },
	],
	"https://asbadrums.com/": [
		{ name: "React", icon: SiReact },
		{ name: "SCSS", icon: SiSass },
		{ name: "JavaScript", icon: SiJavascript },
		{ name: "Content Architecture", icon: FiLayers },
		{ name: "Component Library", icon: FiFolder },
		{ name: "Strapi CMS", icon: SiStrapi },
		{ name: "Editorial Back Office", icon: FiFolder },
		{ name: "Vite", icon: SiVite },
	],
	"https://domainedesfournelles.com/": [
		{ name: "React", icon: SiReact },
		{ name: "SCSS", icon: SiSass },
		{ name: "JavaScript", icon: SiJavascript },
		{ name: "Content-Driven UI", icon: FiLayers },
		{ name: "Editorial Workflows", icon: FiFolder },
		{ name: "Design Integration", icon: FiBriefcase },
		{ name: "Vite", icon: SiVite },
	],
};

const SKILL_GROUP_CONFIG: SkillGroupConfig[] = [
	{
		key: "frontend",
		titleKey: "experience.skillGroups.frontend",
		icon: FiLayers,
		skills: [
			{ name: "React", icon: SiReact },
			{ name: "React Native", icon: SiReact },
			{ name: "TypeScript", icon: SiTypescript },
			{ name: "JavaScript", icon: SiJavascript },
			{ name: "GraphQL", icon: FiServer },
			{ name: "TailwindCSS", icon: SiTailwindcss },
			{ name: "TanStack Query", icon: SiReactquery },
			{ name: "Web Performance Optimization", icon: FiBriefcase },
			{ name: "Vite", icon: SiVite },
		],
	},
	{
		key: "backend",
		titleKey: "experience.skillGroups.backend",
		icon: FiServer,
		skills: [
			{ name: "Node.js", icon: SiNodedotjs },
			{ name: "Strapi", icon: SiStrapi },
			{ name: "Prisma", icon: SiPrisma },
			{ name: "Sequelize", icon: SiSequelize },
			{ name: "REST API Development", icon: FiServer },
			{ name: "Backend Architecture", icon: FiLayers },
			{ name: "Data Modeling", icon: FiFolder },
		],
	},
	{
		key: "dataInfra",
		titleKey: "experience.skillGroups.dataInfra",
		icon: FiBriefcase,
		skills: [
			{ name: "PostgreSQL", icon: SiPostgresql },
			{ name: "Redis", icon: SiRedis },
			{ name: "Docker", icon: SiDocker },
		],
	},
	{
		key: "delivery",
		titleKey: "experience.skillGroups.delivery",
		icon: FiFolder,
		skills: [
			{ name: "Git", icon: SiGit },
			{ name: "API Design", icon: FiServer },
			{ name: "Product Discovery", icon: FiLayers },
			{ name: "System Design", icon: FiBriefcase },
			{ name: "AWS IAM", icon: SiAmazonwebservices },
			{ name: "Google Cloud IAM", icon: SiGooglecloud },
			{ name: "Technical Leadership", icon: FiBriefcase },
		],
	},
	{
		key: "agentic",
		titleKey: "experience.skillGroups.agentic",
		icon: FiLayers,
		skills: [
			{ name: "Claude Code for frontend/UI acceleration", icon: FiLayers },
			{ name: "Codex for logic, state management, and API flows", icon: FiBriefcase },
			{ name: "REST & GraphQL request prototyping", icon: FiServer },
			{ name: "POC-first feature validation", icon: FiFolder },
			{ name: "HTML, Tailwind, and CSS scaffolding", icon: FiFolder },
			{ name: "AI-assisted coding, not full delegation", icon: FiBriefcase },
		],
	},
];

const getRoleBullets = (t: TFunction, rolePath: string): string[] => {
	return ["point1", "point2", "point3"]
		.map((pointKey) => t(`${rolePath}.${pointKey}`))
		.filter((point) => point.trim().length > 0);
};

const getFreelanceProjectHighlights = (
	t: TFunction,
): ExperienceProjectHighlight[] => {
	const projects = t("experience.roles.freelance.projects", {
		returnObjects: true,
	}) as FreelanceProjectTranslation[];

	return projects.map((project) => ({
		name: project.name,
		summary: project.summary,
		bullets: [project.point1, project.point2, project.point3].filter(
			(bullet) => bullet.trim().length > 0,
		),
		ownership: project.ownership?.filter((item) => item.trim().length > 0),
		diagram: project.diagram?.filter(
			(node) => node.label.trim().length > 0 && node.value.trim().length > 0,
		),
		link: project.link,
		technologies: project.link
			? FREELANCE_PROJECT_TECHNOLOGIES[project.link]
			: undefined,
	}));
};

const buildRoles = (t: TFunction): ExperienceRole[] => {
	const freelanceProjectHighlights = getFreelanceProjectHighlights(t);

	return ROLE_KEYS.map((key) => {
		const rolePath = `experience.roles.${key}`;
		const links = ROLE_LINKS[key];
		const technologies = ROLE_TECHNOLOGIES[key];

		return {
			key,
			title: t(`${rolePath}.title`),
			company: t(`${rolePath}.company`),
			period: t(`${rolePath}.period`),
			summary: t(`${rolePath}.summary`),
			bullets: getRoleBullets(t, rolePath),
			ownership: t(`${rolePath}.ownership`, {
				returnObjects: true,
				defaultValue: [],
			}) as string[],
			diagram: t(`${rolePath}.diagram`, {
				returnObjects: true,
				defaultValue: [],
			}) as ArchitectureDiagramNode[],
			links,
			technologies,
			projectHighlights:
				key === "freelance" ? freelanceProjectHighlights : undefined,
		};
	});
};

const getOrderedHobbies = (t: TFunction): string[] => {
	const rawHobbies = t("about.hobbies", {
		returnObjects: true,
	}) as Record<string, string>;

	return Object.entries(rawHobbies)
		.sort(([keyA], [keyB]) => {
			const numberA = Number.parseInt(keyA.replace(/\D/g, ""), 10) || 0;
			const numberB = Number.parseInt(keyB.replace(/\D/g, ""), 10) || 0;
			return numberA - numberB;
		})
		.map(([, value]) => value)
		.filter((hobby) => hobby.trim().length > 0);
};

const About = () => {
	const { t, i18n } = useTranslation();
	const currentLanguage =
		i18n.resolvedLanguage?.startsWith("fr") || i18n.language?.startsWith("fr")
			? "fr"
			: "en";

	const roles = buildRoles(t);
	const softSkillGroups = t("about.softSkills.groups", {
		returnObjects: true,
	}) as SoftSkillGroup[];
	const educationEntries = t("about.education.entries", {
		returnObjects: true,
	}) as EducationEntry[];
	const skillGroups: SkillGroup[] = SKILL_GROUP_CONFIG.map((group) => ({
		...group,
		title: t(group.titleKey),
	}));
	const hobbies = getOrderedHobbies(t);

	return (
		<motion.div
			className='page relative isolate min-h-screen overflow-x-clip pt-8 md:pt-10'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.45 }}>
			<AmbientGlows />
			{createPortal(
				<div className='pointer-events-none fixed bottom-[15px] left-1/2 z-[1300] -translate-x-1/2'>
					<a
						href={`/api/cv-pdf?lang=${currentLanguage}`}
						className='pointer-events-auto inline-flex items-center rounded-none bg-brand-primary px-4 py-2 text-[0.84rem] font-semibold tracking-[0.01em] text-white shadow-[0_8px_20px_rgba(16,22,34,0.28)] transition-colors duration-200 hover:bg-(--color-primary-dark)'>
						{t("about.downloadCvCta")}
					</a>
				</div>,
				document.body,
			)}

			<div className='relative z-10'>
				<AboutHero
					title={t("about.title")}
					heading={t("about.heroHeading")}
					subheading={t("about.heroSubheading")}
					row1Prefix={t("about.heroRows.row1Prefix")}
					row1Items={
						t("about.heroRows.row1Items", { returnObjects: true }) as string[]
					}
					row2Prefix={t("about.heroRows.row2Prefix")}
					row2Items={
						t("about.heroRows.row2Items", { returnObjects: true }) as string[]
					}
					row3Prefix={t("about.heroRows.row3Prefix")}
					row3Items={
						t("about.heroRows.row3Items", { returnObjects: true }) as string[]
					}
					row3Join={t("about.heroRows.row3Join")}
					paragraph={t("about.paragraph1")}
				/>

				<AboutIntro
					paragraphs={[t("about.paragraph2"), t("about.paragraph3"), t("about.paragraph4")]}
				/>

				<AboutTimeline
					title={t("experience.rolesTitle")}
					roles={roles}
					ownershipTitle={t("experience.ownershipTitle")}
				/>

				<AboutEducation
					title={t("about.education.title")}
					intro={t("about.education.intro")}
					entries={educationEntries}
				/>
				<AboutSkills
					title={t("about.skillsTitle")}
					intro={t("about.hardSkillsIntro")}
					skillGroups={skillGroups}
				/>
				<AboutSoftSkills
					title={t("about.softSkillsTitle")}
					intro={t("about.softSkillsIntro")}
					skillGroups={softSkillGroups}
				/>
				<AboutHobbies
					title={t("about.hobbiesTitle")}
					intro={t("about.hobbiesIntro")}
					hobbies={hobbies}
				/>

				<Contact embedded />
			</div>
		</motion.div>
	);
};

export default About;
