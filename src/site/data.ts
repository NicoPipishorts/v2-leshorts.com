// Site content. Structure (slugs, images, links, stack) lives here; all prose lives in
// ./locales/{en,fr}.json and is picked by useContent() from the active i18n language.
// ponytail: project periods are best guesses from git activity — Nicolas to confirm.
import profileImg from "../assets/images/profile-pict.jpg";
import { useTranslation } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

const shots = import.meta.glob("./shots/*.jpg", {
	eager: true,
	import: "default",
}) as Record<string, string>;
const shot = (name: string) => shots[`./shots/${name}.jpg`];

const meBase = {
	name: "Nicolas Pisar",
	first: "Nicolas",
	last: "Pisar",
	timezone: "Europe/Paris",
	photo: profileImg,
	links: {
		github: "https://github.com/NicoPipishorts",
		linkedin: "https://www.linkedin.com/in/nicolaspisar/",
		instagram: "https://www.instagram.com/bricoshorts/",
	},
};

// XOR-obfuscated (same scheme as components/Contact.tsx) so the address isn't plain in the bundle.
export const email = () =>
	[84, 92, 121, 87, 80, 90, 86, 85, 88, 74, 73, 80, 74, 88, 75, 23, 90, 86, 84]
		.map((c) => String.fromCharCode(c ^ 57))
		.join("");


const statsBase = [
	{ value: 10, suffix: "+" },
	{ value: 4000, suffix: "+" },
	{ value: 0, suffix: "" }, // set from the project count below
	{ value: 2, suffix: "" },
];

export const stack = [
	"React", "TypeScript", "React Native", "TanStack", "Next.js", "Tailwind",
	"Node.js", "Fastify", "Express", "PostgreSQL", "Prisma", "Strapi",
	"Supabase", "Redis", "Docker", "Expo", "Vite", "Claude Code",
];

type Base = {
	slug: string;
	name: string;
	kind: "Product" | "Freelance" | "Tool";
	accent: string;
	stack: string[];
	cover?: string;
	gallery: string[];
	link?: string;
};

// Language-independent bits; all prose lives in ./locales/{en,fr}.json keyed by slug.
const base: Base[] = [
	{
		slug: "synqit",
		name: "Synqit",
		kind: "Product",
		accent: "#c6f432",
		stack: ["React 19", "TanStack Router/Query", "Tailwind v4", "Expo", "Fastify", "Prisma", "PostgreSQL", "BullMQ", "Docker + Caddy"],
		cover: shot("synqit-dashboard"),
		gallery: [shot("synqit-home"), shot("synqit-guest"), shot("synqit-transfer"), shot("synqit-mobile")],
		link: "https://synqit.fr",
	},
	{
		slug: "kaast",
		name: "Kaast",
		kind: "Product",
		accent: "#7c5cff",
		stack: ["React", "TypeScript", "TanStack Query", "TanStack Router", "SCSS", "Tailwind", "Meilisearch", "Cloudflare Stream"],
		cover: shot("kaast-player"),
		gallery: [shot("kaast-player")],
		link: "https://kaa.st",
	},
	{
		slug: "horizon-planning",
		name: "Horizon Planning",
		kind: "Freelance",
		accent: "#2f7d8c",
		stack: ["React 19", "Vite", "Tailwind v4", "TanStack Query", "Express 5", "PostgreSQL 17", "Playwright", "Caddy / OVH"],
		cover: shot("horizon-week"),
		gallery: [shot("horizon-assign"), shot("horizon-tracking"), shot("horizon-mobile")],
		link: "https://horizonplanning.fr",
	},
	{
		slug: "comacademy",
		name: "Com'Academy",
		kind: "Freelance",
		accent: "#f2b632",
		stack: ["Expo", "React Native", "Expo Router", "Strapi 5", "PostgreSQL", "React 19", "TanStack Query", "Vercel"],
		cover: shot("comacademy-app"),
		gallery: [shot("comacademy-app3"), shot("comacademy-backoffice"), shot("comacademy-parcours")],
		link: "https://comacademy.fr",
	},
	{
		slug: "asba",
		name: "ASBA Drums",
		kind: "Freelance",
		accent: "#d7e83a",
		stack: ["React", "TypeScript", "TanStack Query", "Tailwind / SASS", "Strapi", "PostgreSQL", "Docker", "Vercel"],
		cover: shot("asba-home"),
		gallery: [shot("asba-hero"), shot("asba-product"), shot("asba-leads")],
		link: "https://asbadrums.com",
	},
	{
		slug: "maison-du-print",
		name: "La Maison du Print",
		kind: "Freelance",
		accent: "#e0457b",
		stack: ["Vue 3", "Vue Router", "Vite", "GSAP", "Swiper", "Sanity", "Vercel Functions", "sharp"],
		cover: shot("print-home"),
		gallery: [shot("print-galerie"), shot("print-atelier")],
		link: "https://lamaisonduprint.fr",
	},
	{
		slug: "np-ebenisterie",
		name: "NP Ébénisterie",
		kind: "Freelance",
		accent: "#c8a24a",
		stack: ["Angular 20", "TypeScript", "Signals", "Zoneless", "Native CSS", "Vercel"],
		cover: shot("np-home"),
		gallery: [shot("np-table"), shot("np-table-detail"), shot("np-process"), shot("np-furniture")],
	},
	{
		slug: "soulbm",
		name: "Sou des Écoles",
		kind: "Freelance",
		accent: "#c2412d",
		stack: ["React", "TanStack Router/Query", "Tailwind", "zod", "Strapi 5", "PostgreSQL", "Anthropic API"],
		cover: shot("soulbm"),
		gallery: [shot("soulbm-events")],
		link: "https://soulbm.fr",
	},
	{
		slug: "ab2c",
		name: "AB2C",
		kind: "Freelance",
		accent: "#8a9a5b",
		stack: ["TanStack Start", "React 19", "Tailwind v4", "Payload 3", "PostgreSQL", "Turborepo", "Coolify"],
		cover: shot("ab2c-home"),
		gallery: [shot("ab2c-services"), shot("ab2c-microferm")],
	},
	{
		slug: "fournelles",
		name: "Domaine des Fournelles",
		kind: "Freelance",
		accent: "#b3263e",
		stack: ["React", "Vite", "Redux", "Sass", "Supabase", "Vercel Functions", "Resend"],
		cover: shot("fournelles"),
		gallery: [shot("fournelles-shop"), shot("fournelles-domaine"), shot("fournelles-domain")],
		link: "https://domainedesfournelles.com",
	},
	{
		slug: "careledger",
		name: "CareLedger",
		kind: "Tool",
		accent: "#1f9d55",
		stack: ["Next.js 16", "React 19", "Drizzle", "PostgreSQL", "Tailwind v4", "Docker", "node:test"],
		cover: shot("careledger-overview"),
		gallery: [shot("careledger-portfolio"), shot("careledger-flow")],
	},
];

// `fr` must have exactly the shape of `en` — a missing translation is a type error.
const dicts: Record<Lang, typeof en> = { en, fr };
export type Lang = "en" | "fr";
type Copy = (typeof en)["projects"]["synqit"];
export type Project = Base &
	Omit<Copy, "layers" | "metrics"> & { layers?: Copy["layers"]; metrics?: Copy["metrics"] };

const build = (lang: Lang) => {
	const d = dicts[lang];
	const projects: Project[] = base.map((b) => {
		const c = d.projects[b.slug as keyof typeof d.projects];
		return { ...b, ...c, layers: c.layers.length ? c.layers : undefined, metrics: c.metrics.length ? c.metrics : undefined };
	});
	return {
		lang,
		ui: d.ui,
		me: { ...meBase, ...d.me, cvUrl: `/api/cv-pdf?lang=${lang}&variant=sfd` },
		projects,
		history: d.history.map((h) => ({ ...h, slug: h.slug || undefined })),
		education: d.education,
		hobbies: d.hobbies.map((h) => ({ ...h, slug: h.slug || undefined })),
		stats: statsBase.map((s, i) => ({ ...s, value: i === 2 ? base.length : s.value, label: d.stats[i] })),
		/** "{n} projects" style interpolation */
		fmt: (s: string, n: number) => s.replace("{n}", String(n)),
	};
};
const content = { en: build("en"), fr: build("fr") };
export type Content = (typeof content)["en"];

/** Content in the site's current language. */
export const useContent = (): Content => {
	const { i18n } = useTranslation();
	return content[i18n.resolvedLanguage?.startsWith("fr") ? "fr" : "en"];
};


export const nextProject = (slug: string, list: Project[]) => {
	const i = list.findIndex((p) => p.slug === slug);
	return list[(i + 1) % list.length];
};

