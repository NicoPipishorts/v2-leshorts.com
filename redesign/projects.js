// Project list for the mockup pages. Facts come from src/site/locales/fr.json and data.ts.
// ponytail: plain global, mockups only; the real site keeps data.ts + locales.
window.PROJECTS = [
	{ slug: "horizon-planning", name: "Horizon Planning", cat: "app", kind: "Logiciel SaaS", year: "2026", img: "horizon-week", featured: true,
		line: "Le planning hebdo des équipes du BTP, sorti du tableur d'une entreprise savoyarde et devenu un SaaS.",
		tags: ["React", "Express", "PostgreSQL", "OVH"], link: "horizonplanning.fr" },
	{ slug: "ab2c", name: "AB2C", cat: "site", kind: "Site & CRM", year: "2026", img: "ab2c-home", featured: true,
		line: "Une marque agricole dessinée au crayon, et le CRM qui gère ses demandes et ses devis.",
		tags: ["TanStack Start", "Payload", "PostgreSQL"], link: "ab2c.pro" },
	{ slug: "comacademy", name: "Com'Academy", cat: "app", kind: "Application iOS & Android", year: "2023 —", img: "comacademy-app", featured: true,
		line: "Apprendre la com' cinq minutes par jour\u00a0: une app sur les deux stores, et son back office.",
		tags: ["Expo", "React Native", "Strapi"], link: "comacademy.fr" },
	{ slug: "asba", name: "ASBA Drums", cat: "site", kind: "Site & admin", year: "2023 —", img: "asba-home", featured: true,
		line: "Le site et l'interface d'admin d'un fabricant de batteries artisanales à Lyon.",
		tags: ["React", "Strapi", "PostgreSQL"], link: "asbadrums.com" },
	{ slug: "kaast", name: "Kaast", cat: "produit", kind: "Produit · cofondateur", year: "2022 —", img: "kaast-player",
		line: "Une plateforme média interne pour cinq entreprises clientes et plus de 4 000 utilisateurs.",
		tags: ["React", "TanStack", "Meilisearch"], link: "kaa.st" },
	{ slug: "synqit", name: "Synqit", cat: "produit", kind: "Produit · fondateur", year: "2024 —", img: "synqit-dashboard",
		line: "Des playlists d'événement partagées sur cinq services de musique, sans compte pour les invités.",
		tags: ["React", "Fastify", "Expo"], link: "synqit.fr" },
	{ slug: "maison-du-print", name: "La Maison du Print", cat: "site", kind: "Site & CMS", year: "2026", img: "print-v1",
		line: "Un atelier de sérigraphie, et quatre versions du design livrées côte à côte.",
		tags: ["Vue 3", "GSAP", "Sanity"], link: "lamaisonduprint.fr" },
	{ slug: "soulbm", name: "Sou des Écoles", cat: "app", kind: "Association", year: "2024 —", img: "soulbm",
		line: "L'association de l'école du village, gérée comme une startup.",
		tags: ["React", "Strapi", "Claude"], link: "soulbm.fr" },
	{ slug: "fournelles", name: "Domaine des Fournelles", cat: "site", kind: "Site & boutique", year: "2022 — 2026", img: "fournelles",
		line: "Un domaine du Beaujolais passé d'un site PHP vieillissant à React.",
		tags: ["React", "Supabase"], link: "domainedesfournelles.com" },
	{ slug: "np-ebenisterie", name: "NP Ébénisterie", cat: "site", kind: "Marque & site", year: "2026", img: "np-home",
		line: "Mes meubles faits main, et le site qui les présente.",
		tags: ["Angular", "CSS natif"] },
	{ slug: "careledger", name: "CareLedger", cat: "outil", kind: "Outil interne", year: "2026", img: "careledger-overview",
		line: "Mon registre de contrats de maintenance\u00a0: heures, infrastructure, suivi client.",
		tags: ["Next.js", "Drizzle", "PostgreSQL"] },
];
// Initials for the coloured project hexagons.
const INI = { "horizon-planning": "HP", ab2c: "AB", comacademy: "CA", asba: "AD", kaast: "K", synqit: "SQ", "maison-du-print": "MP", soulbm: "SÉ", fournelles: "DF", "np-ebenisterie": "NP", careledger: "CL" };
PROJECTS.forEach((p) => (p.ini = INI[p.slug]));
window.projectUrl = (slug) => `project.html?p=${slug}`;
// Dark or white text, whichever reads on a project's accent colour.
window.inkOn = (hex) => {
	const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.3 ? "#111925" : "#ffffff";
};
window.CATS = { site: "Sites", app: "Applications & SaaS", produit: "Produits", outil: "Outils" };
window.shot = (name) => `/src/site/shots/${name}.jpg`;


// Mock form: never sends anything.
document.addEventListener("submit", (e) => {
	e.preventDefault();
	const out = e.target.querySelector("[data-sent]");
	if (out) out.hidden = false;
});
