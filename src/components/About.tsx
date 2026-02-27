import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiBriefcase, FiFolder, FiLayers, FiServer } from "react-icons/fi";
import {
	SiDocker,
	SiGit,
	SiJavascript,
	SiNodedotjs,
	SiPostgresql,
	SiPrisma,
	SiReact,
	SiReactquery,
	SiRedis,
	SiSequelize,
	SiStrapi,
	SiTailwindcss,
	SiTypescript,
	SiVite,
} from "react-icons/si";
import AmbientGlows from "./AmbientGlows";
import Contact from "./Contact";
import AboutHero from "./about/AboutHero";
import AboutHobbies from "./about/AboutHobbies";
import AboutIntro from "./about/AboutIntro";
import AboutSkills from "./about/AboutSkills";
import AboutTimeline from "./about/AboutTimeline";
import {
	ExperienceProjectHighlight,
	ExperienceRole,
	SkillGroup,
} from "./about/types";

const About = () => {
	const { t } = useTranslation();
	const freelanceProjectHighlights = (
		t("experience.roles.freelance.projects", { returnObjects: true }) as Array<{
			name: string;
			summary: string;
			point1: string;
			point2: string;
			point3: string;
			link?: string;
		}>
	).map(
		(project): ExperienceProjectHighlight => ({
			name: project.name,
			summary: project.summary,
			bullets: [project.point1, project.point2, project.point3],
			link: project.link,
		}),
	);

	const roles: ExperienceRole[] = [
		{
			key: "synqit",
			title: t("experience.roles.synqit.title"),
			company: t("experience.roles.synqit.company"),
			period: t("experience.roles.synqit.period"),
			summary: t("experience.roles.synqit.summary"),
			bullets: [
				t("experience.roles.synqit.point1"),
				t("experience.roles.synqit.point2"),
				t("experience.roles.synqit.point3"),
			],
			links: ["https://synqit.fr"],
		},
		{
			key: "kaast",
			title: t("experience.roles.kaast.title"),
			company: t("experience.roles.kaast.company"),
			period: t("experience.roles.kaast.period"),
			summary: t("experience.roles.kaast.summary"),
			bullets: [
				t("experience.roles.kaast.point1"),
				t("experience.roles.kaast.point2"),
				t("experience.roles.kaast.point3"),
			],
			links: ["https://kaa.st"],
		},
		{
			key: "freelance",
			title: t("experience.roles.freelance.title"),
			company: t("experience.roles.freelance.company"),
			period: t("experience.roles.freelance.period"),
			summary: t("experience.roles.freelance.summary"),
			bullets: [
				t("experience.roles.freelance.point1"),
				t("experience.roles.freelance.point2"),
				t("experience.roles.freelance.point3"),
			],
			projectHighlights: freelanceProjectHighlights,
			links: [
				"https://asbadrums.com/",
				"https://comacademy.fr/",
				"https://soulbm.fr",
				"https://domainedesfournelles.com/",
			],
		},
		{
			key: "intercloud",
			title: t("experience.roles.intercloud.title"),
			company: t("experience.roles.intercloud.company"),
			period: t("experience.roles.intercloud.period"),
			summary: t("experience.roles.intercloud.summary"),
			bullets: [
				t("experience.roles.intercloud.point1"),
				t("experience.roles.intercloud.point2"),
				t("experience.roles.intercloud.point3"),
			],
		},
		{
			key: "apple",
			title: t("experience.roles.apple.title"),
			company: t("experience.roles.apple.company"),
			period: t("experience.roles.apple.period"),
			summary: t("experience.roles.apple.summary"),
			bullets: [
				t("experience.roles.apple.point1"),
				t("experience.roles.apple.point2"),
				t("experience.roles.apple.point3"),
			],
		},
		{
			key: "soudesecoles",
			title: t("experience.roles.soudesecoles.title"),
			company: t("experience.roles.soudesecoles.company"),
			period: t("experience.roles.soudesecoles.period"),
			summary: t("experience.roles.soudesecoles.summary"),
			bullets: [
				t("experience.roles.soudesecoles.point1"),
				t("experience.roles.soudesecoles.point2"),
				t("experience.roles.soudesecoles.point3"),
			],
		},
	];

	const skillGroups: SkillGroup[] = [
		{
			key: "frontend",
			title: t("experience.skillGroups.frontend"),
			icon: FiLayers,
			skills: [
				{ name: "React", icon: SiReact },
				{ name: "React Native", icon: SiReact },
				{ name: "TypeScript", icon: SiTypescript },
				{ name: "JavaScript", icon: SiJavascript },
				{ name: "TailwindCSS", icon: SiTailwindcss },
				{ name: "TanStack Query", icon: SiReactquery },
				{ name: "Vite", icon: SiVite },
			],
		},
		{
			key: "backend",
			title: t("experience.skillGroups.backend"),
			icon: FiServer,
			skills: [
				{ name: "Node.js", icon: SiNodedotjs },
				{ name: "Strapi", icon: SiStrapi },
				{ name: "Prisma", icon: SiPrisma },
				{ name: "Sequelize", icon: SiSequelize },
			],
		},
		{
			key: "dataInfra",
			title: t("experience.skillGroups.dataInfra"),
			icon: FiBriefcase,
			skills: [
				{ name: "PostgreSQL", icon: SiPostgresql },
				{ name: "Redis", icon: SiRedis },
				{ name: "Docker", icon: SiDocker },
			],
		},
		{
			key: "delivery",
			title: t("experience.skillGroups.delivery"),
			icon: FiFolder,
			skills: [
				{ name: "Git", icon: SiGit },
				{ name: "API Design", icon: FiServer },
				{ name: "Product Discovery", icon: FiLayers },
				{ name: "Technical Leadership", icon: FiBriefcase },
			],
		},
	];

	const hobbies = [
		t("about.hobbies.item1"),
		t("about.hobbies.item2"),
		t("about.hobbies.item3"),
		t("about.hobbies.item4"),
		t("about.hobbies.item5"),
		t("about.hobbies.item6"),
	];

	return (
		<motion.div
			className='page relative isolate min-h-screen overflow-x-clip pt-8 md:pt-10'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.45 }}>
			<AmbientGlows />

			<div className='relative z-10'>
				<AboutHero
					title={t("about.title")}
					heading={t("about.heroHeading")}
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
					paragraphs={[
						t("about.paragraph2"),
						t("about.paragraph3"),
						t("about.paragraph4"),
					]}
				/>

				<AboutTimeline title={t("experience.rolesTitle")} roles={roles} />

				<AboutSkills
					title={t("about.skillsTitle")}
					intro={t("about.hardSkillsIntro")}
					skillGroups={skillGroups}
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
