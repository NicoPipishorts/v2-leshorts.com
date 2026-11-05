// Builds the static CVs (public/cv/nicolas-pisar-cv-{en,fr}.pdf): HTML in the site's "Crête" design,
// printed to A4 by headless Chrome. Text stays selectable, so ATS parsers can read it.
// Run: node scripts/build-cv.mjs [outDir]
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.resolve(process.argv[2] ?? path.join(ROOT, "public", "cv"));
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const photo = `data:image/jpeg;base64,${fs.readFileSync(path.join(ROOT, "redesign/img/profile-pict.jpg")).toString("base64")}`;
const logoSrc = fs.readFileSync(path.join(ROOT, "redesign/brand.js"), "utf8");
const [hexPath, markPath] = [...logoSrc.matchAll(/^const (?:HEX|MARK) = "([^"]+)"/gm)].map((m) => m[1]);
const logo = (size) =>
	`<svg viewBox="0 0 218 218" width="${size}" height="${size}" aria-hidden="true"><path d="${hexPath}" fill="none" stroke="currentColor" stroke-width="6"/><path d="${markPath}" fill="currentColor"/></svg>`;

// Contour lines for the header bands, drawn by the redesign's own generator (redesign/topo.js).
const topoJs = fs.readFileSync(path.join(ROOT, "redesign/topo.js"), "utf8");

const contact = {
	email: "me@nicolaspisar.com",
	phone: "+33 6 58 77 93 65",
	web: "nicolaspisar.com",
	linkedin: "linkedin.com/in/nicolaspisar",
	github: "github.com/NicoPipishorts",
};

// ---------------------------------------------------------------------------------------------
const CV = {
	en: {
		lang: "en",
		title: "Lead Frontend & Full-stack Engineer",
		tagline: "React · TypeScript · Node.js — AI-augmented delivery",
		location: "La Bâtie-Montgascon, Isère (FR) · remote or hybrid",
		availability: "Open to Lead Frontend / Full-stack roles",
		labels: {
			profile: "Profile",
			ai: "AI-augmented engineering",
			experience: "Experience",
			experienceCont: "Experience (continued)",
			skills: "Skills",
			languages: "Languages",
			education: "Education",
			community: "Leadership & community",
			products: "Products shipped",
			interests: "Outside work",
			page: "Page",
		},
		summary:
			"Frontend-led full-stack engineer with <b>20+ years of hands-on development</b> (coding since 2001) and <b>15+ years shipping production software</b> for clients and for my own products. I lead the frontend architecture of <b>Kaast</b>, a multi-tenant media platform used by <b>4,000+ people across 5 companies</b>, founded <b>Synqit</b>, and have delivered <b>11 web, mobile and back-office products end to end</b>. I work AI-first: agents are wired into my delivery stack and governed by guardrails I built, so I ship at the pace of a small team with the rigour of a larger one — while architecture, review and ownership stay firmly human.",
		figures: [
			["20+", "years of development"],
			["4,000+", "users on Kaast"],
			["11", "products shipped end to end"],
			["2", "products founded"],
			["FR / EN", "fully bilingual"],
		],
		ai: [
			"<b>Daily agentic development</b> with Claude Code, OpenAI Codex and Cursor — prototyping, refactors, test writing, code review and documentation. AI-assisted, never blindly delegated.",
			"<b>MCP integrations</b> connecting agents to the real delivery stack — GitHub, Linear, Supabase, Vercel and a live browser — so they read issues, inspect databases and deployments, and verify UI changes before I review them.",
			"<b>Built claude-team-kit</b>, reusable Claude Code scaffolding installed across my repositories: a read-only git/PR guard agent, a test gate that ties green tests to the exact committed tree (hashed receipts), and an agent forge to create and retire specialised agents safely.",
			"<b>Agent-ready repositories</b>: CLAUDE.md / AGENTS.md conventions, user stories and specs so AI contributions follow the architecture instead of drifting.",
			"<b>LLMs in production</b>: Claude API receipt scanning (photo → structured inventory lines) in the Sou des Écoles operations back office.",
		],
		jobs1: [
			{
				company: "Synqit",
				role: "Founder & Product Engineer",
				period: "2024 — present",
				context: "Collaborative event playlists and cross-service playlist sync (Spotify, Apple Music, TIDAL, YouTube Music, Deezer). synqit.fr",
				points: [
					"Designed and built the whole product: Fastify modular monolith with BullMQ workers, Prisma/PostgreSQL data model, React 19 web app, Expo iOS/Android app and a Mantine back office.",
					"Sync & transfer engine with ISRC-first track matching, snapshot-based change detection and per-track checkpoints that resume after provider quota limits.",
					"Stripe billing (web Checkout, mobile Payment Sheet) granted only through idempotent webhooks; one plan table drives every paywall.",
					"Production on Docker Compose + Caddy with Prometheus/Grafana monitoring, tag-based releases and EN/FR/ES localisation.",
				],
			},
		],
		jobs2: [
			{
				company: "Kaast",
				role: "Co-Founder & Lead Frontend Engineer",
				period: "2022 — present",
				context: "Multi-tenant internal media platform — 5 client companies, 4,000+ users.",
				points: [
					"Led the frontend architecture of the multi-tenant React/TypeScript platform: page composition, navigation flows and the product's interaction model.",
					"Built the shared component library that lets every tenant carry its own brand while the product stays one consistent, maintainable codebase.",
					"Search and routing with TanStack Router and Meilisearch; state and cache with TanStack Query; video delivered through Cloudflare Stream.",
					"Two-person Kanban team shipping customer-driven features inside tight audit windows, working directly with client stakeholders.",
				],
			},
			{
				company: "leshorts.com — freelance",
				role: "Freelance web & mobile developer",
				period: "2010 — present",
				context: "Web, mobile and back-office products for startups, SMEs and associations — from discovery and data modelling to deployment and yearly maintenance contracts.",
				points: [
					"<b>Com'Academy</b> — freemium iOS/Android learning app (Expo/React Native, Strapi 5): weekly-challenge engine, in-app purchases, ~30-page back office; in production across several graduate schools.",
					"<b>Horizon Planning</b> — multi-tenant crew-planning SaaS for construction firms (React 19, Express 5, PostgreSQL 17): tenant isolation tested with pgTAP, RBAC with audit log, installable PWA.",
					"<b>ASBA Drums, Domaine des Fournelles, AB2C, La Maison du Print, NP Ébénisterie</b> — brand sites with catalogues, secure admins (Supabase Auth, Strapi, Sanity, Payload) and order or lead flows.",
					"Security-hardened hosting and maintenance (Docker, UFW, Fail2ban, Vercel, Cloudflare) for long-running client platforms.",
				],
			},
			{
				company: "InterCloud",
				role: "Frontend Developer",
				period: "2021 — 2022",
				context: "SaaS dashboard for network-deployment workflows — joined at proof of concept, shipped the customer-facing MVP and V1.",
				points: [
					"Built React interfaces that turned complex infrastructure operations into clear, maintainable product flows.",
					"Contributed to the shared UI layer, state and cache management, real-time events and search tooling.",
					"One of two frontend developers in a 10-person product team (backend, SRE, PO, PM) under fast agile delivery.",
				],
			},
			{
				company: "Apple",
				role: "Technical Support & Product Testing",
				period: "Earlier",
				context: "",
				points: ["Structured, user-focused troubleshooting in high-volume contexts; product testing and quality feedback loops."],
			},
		],
		community: {
			company: "Sou des Écoles de La Bâtie-Montgascon",
			role: "President — nonprofit parents' association",
			period: "2024 — present",
			points: [
				"Lead a volunteer team running 7 fundraising events a year, securing €900+ per classroom for school trips and activities.",
				"Designed, built and run the association's website and operations back office: treasury, events, inventory, roles and audit log.",
			],
		},
		skills: [
			["Frontend", "React, TypeScript, React Native / Expo, TanStack Router & Query, Next.js, Vite, Tailwind, design systems, accessibility, performance"],
			["Backend & data", "Node.js, Fastify, Express, REST & GraphQL, PostgreSQL, Prisma, Drizzle, Supabase, Strapi, Redis / BullMQ, Meilisearch"],
			["Platform & delivery", "Docker, Caddy / Nginx, Vercel, Cloudflare, CI/CD, Playwright, Stripe, security hardening, monitoring"],
			["AI & agents", "Claude Code, Codex, Cursor, MCP servers, Claude API, agent guardrails, AI-assisted review"],
		],
		languages: [
			["French", "native"],
			["English", "fluent — 10 years in the USA"],
		],
		education: [
			["École O'Clock", "Web & Mobile Developer — React specialisation", "2021 — 2022"],
			["PVPHS (USA)", "High school diploma", "2004"],
		],
		products: [
			["Synqit", "playlist sync SaaS + mobile"],
			["Kaast", "multi-tenant media platform"],
			["Horizon Planning", "crew-planning SaaS, PWA"],
			["Com'Academy", "iOS/Android app + back office"],
			["Sou des Écoles", "site + operations back office"],
			["ASBA Drums", "catalogue, CRM, back office"],
			["AB2C", "design system + CMS site"],
			["Domaine des Fournelles", "wine site + order flow"],
			["La Maison du Print", "site + custom admin"],
			["NP Ébénisterie", "furniture brand, Angular 20"],
			["CareLedger", "maintenance-contract tracker"],
		],
		interests: "Paragliding, woodworking (my own furniture brand, NP Ébénisterie), skating, family expeditions.",
	},
	fr: {
		lang: "fr",
		title: "Lead Développeur Frontend & Full-stack",
		tagline: "React · TypeScript · Node.js — livraison augmentée par l'IA",
		location: "La Bâtie-Montgascon, Isère · remote ou hybride",
		availability: "Ouvert à un poste Lead Frontend / Full-stack",
		labels: {
			profile: "Profil",
			ai: "Ingénierie augmentée par l'IA",
			experience: "Expérience",
			experienceCont: "Expérience (suite)",
			skills: "Compétences",
			languages: "Langues",
			education: "Formation",
			community: "Leadership & engagement",
			products: "Produits livrés",
			interests: "Hors travail",
			page: "Page",
		},
		summary:
			"Ingénieur full-stack à dominante frontend, avec <b>plus de 20 ans de développement</b> (je code depuis 2001) et <b>plus de 15 ans de logiciels livrés en production</b> pour des clients et pour mes propres produits. Je pilote l'architecture frontend de <b>Kaast</b>, plateforme média multi-tenant utilisée par <b>plus de 4 000 personnes dans 5 entreprises</b>, j'ai fondé <b>Synqit</b> et livré <b>11 produits web, mobiles et back-office de bout en bout</b>. Je travaille « AI-first » : des agents branchés sur ma chaîne de livraison et encadrés par des garde-fous que j'ai construits me permettent d'avancer au rythme d'une petite équipe avec la rigueur d'une grande — l'architecture, la revue et la responsabilité restant résolument humaines.",
		figures: [
			["20+", "ans de développement"],
			["4 000+", "utilisateurs sur Kaast"],
			["11", "produits livrés de bout en bout"],
			["2", "produits fondés"],
			["FR / EN", "bilingue"],
		],
		ai: [
			"<b>Développement agentique au quotidien</b> avec Claude Code, OpenAI Codex et Cursor — prototypage, refactorings, écriture de tests, revue de code et documentation. Assisté par l'IA, jamais délégué à l'aveugle.",
			"<b>Intégrations MCP</b> reliant les agents à la vraie chaîne de livraison — GitHub, Linear, Supabase, Vercel et un navigateur réel — pour lire les tickets, inspecter bases de données et déploiements, et vérifier les changements d'interface avant ma revue.",
			"<b>Création de claude-team-kit</b>, un socle Claude Code réutilisable installé sur mes dépôts : agent de garde git/PR en lecture seule, porte de tests liant les tests verts à l'arbre exact commité (reçus hachés) et « agent forge » pour créer et retirer des agents spécialisés en sécurité.",
			"<b>Dépôts prêts pour les agents</b> : conventions CLAUDE.md / AGENTS.md, user stories et spécifications pour que les contributions de l'IA suivent l'architecture au lieu de dériver.",
			"<b>LLM en production</b> : lecture de tickets de caisse via l'API Claude (photo → lignes d'inventaire structurées) dans le back office du Sou des Écoles.",
		],
		jobs1: [
			{
				company: "Synqit",
				role: "Fondateur & Product Engineer",
				period: "2024 — aujourd'hui",
				context: "Playlists collaboratives pour événements et synchronisation multi-services (Spotify, Apple Music, TIDAL, YouTube Music, Deezer). synqit.fr",
				points: [
					"Conception et développement de tout le produit : monolithe modulaire Fastify avec workers BullMQ, modèle de données Prisma/PostgreSQL, app web React 19, app Expo iOS/Android et back office Mantine.",
					"Moteur de synchro et de transfert : matching par ISRC, détection de changements par snapshots et checkpoints par morceau qui reprennent après les quotas des services.",
					"Facturation Stripe (Checkout web, Payment Sheet mobile) accordée uniquement via des webhooks idempotents ; une seule table de plans pilote tous les paywalls.",
					"Production sous Docker Compose + Caddy avec monitoring Prometheus/Grafana, releases par tags et localisation EN/FR/ES.",
				],
			},
		],
		jobs2: [
			{
				company: "Kaast",
				role: "Cofondateur & Lead Frontend Engineer",
				period: "2022 — aujourd'hui",
				context: "Plateforme média interne multi-tenant — 5 entreprises clientes, plus de 4 000 utilisateurs.",
				points: [
					"Pilotage de l'architecture frontend de la plateforme multi-tenant React/TypeScript : composition des pages, navigation et modèle d'interaction.",
					"Création de la librairie de composants partagée permettant à chaque tenant d'avoir sa marque tout en gardant une base de code unique, cohérente et maintenable.",
					"Recherche et routing avec TanStack Router et Meilisearch ; state et cache avec TanStack Query ; vidéo diffusée via Cloudflare Stream.",
					"Équipe Kanban de deux personnes livrant des fonctionnalités demandées par les clients dans des fenêtres d'audit serrées, en lien direct avec leurs équipes.",
				],
			},
			{
				company: "leshorts.com — à mon compte",
				role: "Développeur web & mobile freelance",
				period: "2010 — aujourd'hui",
				context: "Produits web, mobiles et back offices pour startups, PME et associations — de la découverte et la modélisation des données jusqu'au déploiement et aux contrats de maintenance annuels.",
				points: [
					"<b>Com'Academy</b> — app freemium iOS/Android d'apprentissage (Expo/React Native, Strapi 5) : moteur de défis hebdomadaires, achats in-app, back office d'une trentaine de pages ; en production dans plusieurs écoles supérieures.",
					"<b>Horizon Planning</b> — SaaS multi-tenant de planning d'équipes du BTP (React 19, Express 5, PostgreSQL 17) : isolation des tenants testée avec pgTAP, RBAC avec journal d'audit, PWA installable.",
					"<b>ASBA Drums, Domaine des Fournelles, AB2C, La Maison du Print, NP Ébénisterie</b> — sites de marque avec catalogues, back offices sécurisés (Supabase Auth, Strapi, Sanity, Payload) et parcours de commande ou de prospects.",
					"Hébergement durci et maintenance (Docker, UFW, Fail2ban, Vercel, Cloudflare) de plateformes clientes sur la durée.",
				],
			},
			{
				company: "InterCloud",
				role: "Développeur Frontend",
				period: "2021 — 2022",
				context: "Dashboard SaaS de déploiement réseau — arrivé au stade de la preuve de concept, livraison du MVP puis de la V1 client.",
				points: [
					"Développement d'interfaces React transformant des opérations d'infrastructure complexes en parcours produit clairs et maintenables.",
					"Contribution à la couche UI partagée, à la gestion du state et du cache, aux événements temps réel et aux outils de recherche.",
					"Un des deux développeurs frontend d'une équipe produit de 10 personnes (backend, SRE, PO, PM) en agile soutenu.",
				],
			},
			{
				company: "Apple",
				role: "Support technique & tests produit",
				period: "Auparavant",
				context: "",
				points: ["Résolution de problèmes structurée et orientée utilisateur en contexte à fort volume ; tests produit et boucles de retour qualité."],
			},
		],
		community: {
			company: "Sou des Écoles de La Bâtie-Montgascon",
			role: "Président — association de parents d'élèves",
			period: "2024 — aujourd'hui",
			points: [
				"Direction d'une équipe de bénévoles organisant 7 événements de collecte par an, soit plus de 900 € par classe pour les sorties et activités.",
				"Conception, développement et gestion du site et du back office de l'association : trésorerie, événements, inventaire, rôles et journal d'audit.",
			],
		},
		skills: [
			["Frontend", "React, TypeScript, React Native / Expo, TanStack Router & Query, Next.js, Vite, Tailwind, design systems, accessibilité, performance"],
			["Backend & données", "Node.js, Fastify, Express, REST & GraphQL, PostgreSQL, Prisma, Drizzle, Supabase, Strapi, Redis / BullMQ, Meilisearch"],
			["Plateforme & livraison", "Docker, Caddy / Nginx, Vercel, Cloudflare, CI/CD, Playwright, Stripe, sécurisation, monitoring"],
			["IA & agents", "Claude Code, Codex, Cursor, serveurs MCP, API Claude, garde-fous d'agents, revue assistée par l'IA"],
		],
		languages: [
			["Français", "langue maternelle"],
			["Anglais", "courant — 10 ans aux USA"],
		],
		education: [
			["École O'Clock", "Développeur Web & Web Mobile — spécialisation React", "2021 — 2022"],
			["PVPHS (USA)", "High school diploma (baccalauréat)", "2004"],
		],
		products: [
			["Synqit", "SaaS de synchro + mobile"],
			["Kaast", "plateforme média multi-tenant"],
			["Horizon Planning", "SaaS de planning, PWA"],
			["Com'Academy", "app iOS/Android + back office"],
			["Sou des Écoles", "site + back office opérationnel"],
			["ASBA Drums", "catalogue, CRM, back office"],
			["AB2C", "design system + site CMS"],
			["Domaine des Fournelles", "site viticole + commandes"],
			["La Maison du Print", "site + back office sur mesure"],
			["NP Ébénisterie", "marque de mobilier, Angular 20"],
			["CareLedger", "suivi de contrats de maintenance"],
		],
		interests: "Parapente, ébénisterie (ma propre marque de mobilier, NP Ébénisterie), skate, expéditions en famille.",
	},
};

// ---------------------------------------------------------------------------------------------
// content above is authored HTML (only <b>), nothing user-supplied, so it is inserted as-is
const section = (label) => `<h2 class="sec"><span>${label}</span></h2>`;
const job = (j) => `
	<article class="job">
		<header><h3>${j.company}</h3><span class="period">${j.period}</span></header>
		<p class="role">${j.role}</p>
		${j.context ? `<p class="context">${j.context}</p>` : ""}
		<ul>${j.points.map((p) => `<li>${p}</li>`).join("")}</ul>
	</article>`;

const page = (n, total, cv, main, aside, top = "") => `
	<section class="page">
		${top || `<div class="band slim" data-topo="${n * 7}"><span class="flogo">${logo(18)}</span><strong>Nicolas Pisar</strong><span>${cv.title}</span></div>`}
		<div class="body">
			<div class="cols"><main>${main}</main><aside>${aside}</aside></div>
			<footer><span class="flogo">${logo(14)}</span><span>Nicolas Pisar — leshorts.com</span><span>${contact.web} · ${cv.labels.page} ${n}/${total}</span></footer>
		</div>
	</section>`;

const html = (cv) => `<!doctype html>
<html lang="${cv.lang}"><head><meta charset="utf-8"><title>Nicolas Pisar — CV (${cv.lang.toUpperCase()})</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..800&family=IBM+Plex+Mono:wght@400;500&display=block" rel="stylesheet">
<style>
	/* "Crête" design, same as the site: slate-night header with coral contour lines, Archivo, IBM Plex Mono labels */
	@page { size: A4; margin: 0; }
	:root { --snow:#eff1f4; --card:#ffffff; --ink:#111925; --soft:#5a6573; --line:#d5dae1; --night:#111925;
		--on-night:#e9edf2; --on-night-soft:#9aa6b4; --night-line:rgba(255,255,255,.14); --contour:#4b3238; --sail:#dc5c48; }
	* { box-sizing: border-box; margin: 0; padding: 0; }
	html, body { background: var(--snow); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
	body { font: 400 8.5pt/1.45 Archivo, sans-serif; color: var(--ink); }
	b { font-weight: 650; }
	.page { width: 210mm; height: 297mm; display: flex; flex-direction: column; page-break-after: always; overflow: hidden; position: relative; }
	.page:last-child { page-break-after: auto; }
	.body { flex: 1; display: flex; flex-direction: column; padding: 0 13mm 9mm; min-height: 0; }
	.hex { clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); }

	/* night header band with the site's contour lines */
	.band { position: relative; overflow: hidden; background: var(--night); color: var(--on-night); padding: 11mm 13mm 8mm; }
	.band .topo { position: absolute; inset: 0; width: 100%; height: 100%; color: var(--contour);
		mask-image: linear-gradient(100deg, transparent 25%, #000 80%); -webkit-mask-image: linear-gradient(100deg, transparent 25%, #000 80%); }
	.band > :not(.topo) { position: relative; }
	.head { display: grid; grid-template-columns: 32mm 1fr; gap: 7mm; align-items: center; }
	.photo { width: 32mm; height: 32mm; position: relative; }
	.photo .ring, .photo .ring::after, .photo img { clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); }
	.photo .ring { position: absolute; inset: -1.6mm; background: var(--sail); }
	.photo .ring::after { content: ""; position: absolute; inset: .5mm; background: var(--night); }
	.photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
	h1 { font: 750 27pt/0.95 Archivo, sans-serif; font-stretch: 112%; letter-spacing: -0.025em; }
	h1 .last { color: var(--sail); }
	.title { margin-top: 2.4mm; font: 650 11pt/1.2 Archivo, sans-serif; font-stretch: 108%; }
	.tagline { font: 400 8.4pt/1.3 Archivo, sans-serif; color: var(--on-night-soft); margin-top: .8mm; }
	.contact { margin-top: 3.4mm; display: flex; flex-wrap: wrap; gap: 1.2mm 4.5mm; font: 400 7pt/1.3 "IBM Plex Mono", monospace; }
	.contact a { color: inherit; text-decoration: none; }
	.contact span::before { content: ""; display: inline-block; width: 1.5mm; height: 1.7mm; margin-right: 1.5mm; background: var(--sail); vertical-align: -.1mm;
		clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); }
	.avail { display: inline-flex; margin-bottom: 2.6mm; align-items: center; gap: 1.8mm; border: 1px solid var(--night-line); background: rgba(17, 25, 37, .7);
		border-radius: 99px; padding: 1.1mm 3mm 1.1mm 2.2mm; font: 500 6.5pt/1 "IBM Plex Mono", monospace; text-transform: uppercase; letter-spacing: .08em; }
	.avail i { width: 1.8mm; height: 1.8mm; border-radius: 50%; background: #5fd38d; box-shadow: 0 0 0 .8mm rgba(95, 211, 141, .2); }
	.summary { margin-top: 5.5mm; font-size: 8.8pt; line-height: 1.55; max-width: 176mm; }
	.summary b { color: #fff; }
	.figures { margin-top: 5mm; display: grid; grid-template-columns: repeat(5, 1fr); gap: 4mm; }
	.figures div { border-top: 1.5px solid var(--sail); padding-top: 2.2mm; }
	.figures strong { display: block; font: 750 14pt/1 Archivo, sans-serif; font-stretch: 112%; letter-spacing: -0.02em; color: #fff; }
	.figures span { display: block; margin-top: 1.2mm; font: 400 6.2pt/1.25 "IBM Plex Mono", monospace; text-transform: uppercase; letter-spacing: .06em; color: var(--on-night-soft); }

	/* slim band on the following pages */
	.band.slim { padding: 5.5mm 13mm; display: flex; align-items: center; gap: 3mm; }
	.band.slim .flogo { color: var(--sail); display: flex; }
	.band.slim strong { font: 700 10pt/1 Archivo, sans-serif; font-stretch: 112%; }
	.band.slim > span:last-child { margin-left: auto; font: 400 6.6pt/1 "IBM Plex Mono", monospace; text-transform: uppercase; letter-spacing: .08em; color: var(--on-night-soft); }

	/* columns */
	.cols { flex: 1; display: grid; grid-template-columns: 1fr 54mm; gap: 8mm; margin-top: 6mm; min-height: 0; }
	aside { border-left: 1px solid var(--line); padding-left: 6mm; }
	.sec { display: flex; align-items: center; gap: 2.5mm; margin: 0 0 2.8mm; font: 500 7pt/1 "IBM Plex Mono", monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--sail); }
	.sec::after { content: ""; flex: 1; height: 1px; background: var(--line); }
	* + .sec { margin-top: 5.5mm; }

	.ai { list-style: none; background: var(--card); border: 1px solid var(--line); border-top: 2px solid var(--sail); border-radius: 1mm; padding: 3mm 3.6mm; }
	.ai li { position: relative; padding-left: 3.6mm; }
	.ai li + li { margin-top: 1.5mm; }
	.ai li::before { content: ""; position: absolute; left: 0; top: 1.6mm; width: 1.5mm; height: 1.7mm; background: var(--sail);
		clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); }

	.job + .job { margin-top: 4mm; }
	.job header { display: flex; justify-content: space-between; align-items: baseline; gap: 3mm; }
	.job h3 { font: 750 10.4pt/1.2 Archivo, sans-serif; font-stretch: 112%; letter-spacing: -0.015em; }
	.period { font: 400 6.8pt/1 "IBM Plex Mono", monospace; color: var(--soft); white-space: nowrap; }
	.role { margin-top: .6mm; font-weight: 650; color: var(--sail); }
	.context { margin-top: .6mm; color: var(--soft); }
	.job ul { margin-top: 1.5mm; list-style: none; }
	.job li { position: relative; padding-left: 3.4mm; }
	.job li + li { margin-top: .9mm; }
	.job li::before { content: ""; position: absolute; left: 0; top: 2mm; width: 1.8mm; height: 1px; background: var(--sail); }

	.kv + .kv { margin-top: 2.4mm; }
	.kv dt { font: 500 6.6pt/1.2 "IBM Plex Mono", monospace; text-transform: uppercase; letter-spacing: .08em; color: var(--soft); }
	.kv dd { margin-top: .7mm; line-height: 1.45; }
	.edu + .edu { margin-top: 2.2mm; }
	.edu strong { display: block; font-weight: 650; }
	.edu span { display: block; color: var(--soft); }
	.edu em { font: normal 400 6.6pt/1 "IBM Plex Mono", monospace; color: var(--soft); }
	.products li { display: flex; flex-direction: column; list-style: none; }
	.products li + li { margin-top: 1.4mm; }
	.products strong { font-weight: 650; }
	.products span { color: var(--soft); font-size: 7.5pt; }

	footer { display: flex; align-items: center; gap: 3mm; justify-content: space-between; margin-top: 4mm; padding-top: 2.6mm; border-top: 1px solid var(--line);
		font: 400 6.4pt/1 "IBM Plex Mono", monospace; color: var(--soft); text-transform: uppercase; letter-spacing: .06em; }
	footer .flogo { color: var(--sail); display: flex; }
	footer span:nth-child(2) { flex: 1; }
</style></head><body>
${(() => {
	const top = `
		<div class="band" data-topo="21">
		<div class="head">
			<div class="photo"><div class="ring"></div><img src="${photo}" alt=""></div>
			<div>
				<div class="avail"><i></i>${cv.availability}</div>
				<h1>Nicolas <span class="last">Pisar</span></h1>
				<p class="title">${cv.title}</p>
				<p class="tagline">${cv.tagline}</p>
				<p class="contact">
					<span><a href="mailto:${contact.email}">${contact.email}</a></span>
					<span><a href="tel:${contact.phone.replace(/\s/g, "")}">${contact.phone}</a></span>
					<span>${cv.location}</span>
					<span><a href="https://${contact.web}">${contact.web}</a></span>
					<span><a href="https://${contact.linkedin}">${contact.linkedin}</a></span>
					<span><a href="https://${contact.github}">${contact.github}</a></span>
				</p>
			</div>
		</div>
		<p class="summary">${cv.summary}</p>
		<div class="figures">${cv.figures.map(([v, l]) => `<div><strong>${v}</strong><span>${l}</span></div>`).join("")}</div>
		</div>`;

	const main1 = `
		${section(cv.labels.ai)}
		<ul class="ai">${cv.ai.map((p) => `<li>${p}</li>`).join("")}</ul>
		${section(cv.labels.experience)}
		${cv.jobs1.map(job).join("")}`;
	const aside1 = `
		${section(cv.labels.skills)}
		${cv.skills.map(([k, v]) => `<dl class="kv"><dt>${k}</dt><dd>${v}</dd></dl>`).join("")}
		${section(cv.labels.languages)}
		${cv.languages.map(([k, v]) => `<div class="edu"><strong>${k}</strong><span>${v}</span></div>`).join("")}`;

	const main2 = `
		${section(cv.labels.experienceCont)}
		${cv.jobs2.map(job).join("")}
		${section(cv.labels.community)}
		${job(cv.community)}`;
	const aside2 = `
		${section(cv.labels.products)}
		<ul class="products">${cv.products.map(([n, d]) => `<li><strong>${n}</strong><span>${d}</span></li>`).join("")}</ul>
		${section(cv.labels.education)}
		${cv.education.map(([s, t, y]) => `<div class="edu"><strong>${s}</strong><span>${t}</span><em>${y}</em></div>`).join("")}
		${section(cv.labels.interests)}
		<p>${cv.interests}</p>`;

	// page 1 carries the header above its two columns
	return page(1, 2, cv, main1, aside1, top) + page(2, 2, cv, main2, aside2);
})()}
<script>${topoJs}</script>
</body></html>`;

// ---------------------------------------------------------------------------------------------
fs.mkdirSync(OUT, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cv-"));
for (const cv of Object.values(CV)) {
	const htmlFile = path.join(tmp, `cv-${cv.lang}.html`);
	let doc = html(cv);
	// French typography: non-breaking spaces so « ; : ? ! » never start a line
	if (cv.lang === "fr") doc = doc.replace(/ ([;:?!»])/g, "\u00a0$1").replace(/« /g, "«\u00a0");
	fs.writeFileSync(htmlFile, doc);
	const pdf = path.join(OUT, `nicolas-pisar-cv-${cv.lang}.pdf`);
	execFileSync(CHROME, [
		"--headless=new",
		"--disable-gpu",
		"--no-pdf-header-footer",
		"--virtual-time-budget=10000",
		`--print-to-pdf=${pdf}`,
		`file://${htmlFile}`,
	], { stdio: "ignore" });
	console.log("wrote", path.relative(ROOT, pdf));
}
