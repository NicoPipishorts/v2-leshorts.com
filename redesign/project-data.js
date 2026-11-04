// Case-study content for project.html, one entry per slug. Generated once from src/site/data.ts (accent,
// link, stack, images) and src/site/locales/fr.json (texts) — copy edits belong in those files first.
// Horizon Planning: migration count, plans and signup status corrected against its repo (Nov 2026).
window.DETAILS = {
	"synqit": {
		"accent": "#c6f432",
		"link": "https://synqit.fr",
		"stack": [
			"React 19",
			"TanStack Router/Query",
			"Tailwind v4",
			"Expo",
			"Fastify",
			"Prisma",
			"PostgreSQL",
			"BullMQ",
			"Docker + Caddy"
		],
		"cover": "synqit-dashboard",
		"gallery": [
			"synqit-home",
			"synqit-guest",
			"synqit-transfer",
			"synqit-mobile"
		],
		"role": "Fondateur & Product Engineer",
		"period": "2024 — aujourd’hui",
		"tagline": "Un lien magique. Tous les services de streaming. Les morceaux de tout le monde.",
		"summary": "Playlists collaboratives pour événements et synchronisation de playlists entre services. L’hôte partage un seul lien magique ; les invités ajoutent des morceaux sans inscription, depuis Spotify, Apple Music, TIDAL, YouTube Music et d’autres.",
		"challenge": "Faire de cinq API musicales — catalogues, quotas et modèles d’authentification différents — un seul produit, sans aucune friction pour l’invité qui veut juste ajouter un morceau.",
		"built": [
			{
				"title": "Parcours invité par lien magique",
				"body": "Liens d’événement révocables et régénérables ; les invités cherchent et ajoutent des morceaux, doublons refusés, n’importe quel service peut héberger via un registre d’adaptateurs."
			},
			{
				"title": "Moteur de synchro & transfert",
				"body": "Planificateur à back-off adaptatif, détection de changements par snapshot/manifest, matching ISRC en priorité et checkpoints par morceau pour reprendre après un quota plutôt que recommencer."
			},
			{
				"title": "Une facturation qui ne dérive pas",
				"body": "Stripe Checkout sur le web, Payment Sheet sur mobile, droits accordés uniquement via des webhooks idempotents, paywalls 402 pilotés par une seule table de plans."
			},
			{
				"title": "Back office & analytics",
				"body": "Console Mantine avec parcours en Sankey et heatmap en direct, analytics minimisées selon les recommandations de la CNIL."
			}
		],
		"layers": [
			{
				"label": "Clients",
				"value": "App web React · Expo iOS/Android · back office Mantine"
			},
			{
				"label": "API",
				"value": "Monolithe modulaire Fastify, sessions cookie + CSRF"
			},
			{
				"label": "Workers",
				"value": "BullMQ sur Redis — synchro, transferts, imports"
			},
			{
				"label": "Données",
				"value": "Prisma + PostgreSQL"
			},
			{
				"label": "Services",
				"value": "Spotify · Apple Music · TIDAL · YouTube · Deezer"
			}
		],
		"metrics": [
			{
				"value": "5",
				"label": "services musicaux"
			},
			{
				"value": "3",
				"label": "langues"
			},
			{
				"value": "0",
				"label": "inscription pour les invités"
			}
		]
	},
	"kaast": {
		"accent": "#7c5cff",
		"link": "https://kaa.st",
		"stack": [
			"React",
			"TypeScript",
			"TanStack Query",
			"TanStack Router",
			"SCSS",
			"Tailwind",
			"Meilisearch",
			"Cloudflare Stream"
		],
		"cover": "kaast-player",
		"gallery": [
			"kaast-player"
		],
		"role": "Cofondateur & Lead Frontend Engineer",
		"period": "2022 — aujourd’hui",
		"tagline": "Les médias internes, diffusés comme une plateforme premium.",
		"summary": "Plateforme de communication média interne multi-tenant utilisée par 5 entreprises clientes et plus de 4 000 utilisateurs, avec un fort enjeu de qualité frontend, de navigation, de recherche et de cohérence UI malgré des besoins spécifiques selon les tenants.",
		"challenge": "Une seule base de code, plusieurs marques : chaque tenant veut son look et ses parcours, tandis que le produit doit rester cohérent, rapide et maintenable par une équipe de deux.",
		"built": [
			{
				"title": "Architecture frontend",
				"body": "Pilotage de la plateforme React multi-tenant — composition des pages, parcours de navigation et modèle d’interaction global."
			},
			{
				"title": "Système de composants partagé",
				"body": "Une librairie de composants permettant la personnalisation par tenant tout en gardant une expérience produit cohérente."
			},
			{
				"title": "Recherche & routing",
				"body": "TanStack Router, Meilisearch et une navigation structurée pour séries, saisons, shorts et playlists."
			},
			{
				"title": "Livraison pilotée par le client",
				"body": "Équipe Kanban de deux personnes, features livrées dans des périodes d’audit serrées, besoins des parties prenantes traduits en UX intuitive."
			}
		],
		"layers": [
			{
				"label": "Frontend",
				"value": "Interface produit React pour les workflows de communication interne"
			},
			{
				"label": "Système UI",
				"value": "Librairie de composants, SCSS, Tailwind, intégrations Cloudflare"
			},
			{
				"label": "Recherche & routing",
				"value": "TanStack Router, Meilisearch et navigation structurée"
			},
			{
				"label": "State & données",
				"value": "TanStack Query, gestion du cache et du state, flux API connectés"
			}
		],
		"metrics": [
			{
				"value": "4 000+",
				"label": "utilisateurs"
			},
			{
				"value": "5",
				"label": "entreprises clientes"
			},
			{
				"value": "2",
				"label": "personnes dans l’équipe"
			}
		]
	},
	"horizon-planning": {
		"accent": "#2f7d8c",
		"link": "https://horizonplanning.fr",
		"stack": [
			"React 19",
			"Vite",
			"Tailwind v4",
			"TanStack Query",
			"Express 5",
			"PostgreSQL 17",
			"Playwright",
			"Caddy / OVH"
		],
		"cover": "horizon-week",
		"gallery": [
			"horizon-assign",
			"horizon-tracking",
			"horizon-mobile"
		],
		"role": "Conception produit & développement full-stack",
		"period": "2026",
		"tagline": "Le planning hebdo des équipes, enfin sorti du tableur.",
		"summary": "SaaS de planification hebdomadaire des équipes pour les entreprises du bâtiment et de la rénovation. Né comme outil interne d’une entreprise de rénovation savoyarde, devenu un produit multi-tenant avec abonnements (inscriptions en libre-service bientôt ouvertes).",
		"challenge": "Remplacer un tableur fragile qui faisait tourner la semaine de toute une entreprise — sans ralentir ceux qui le remplissent chaque matin sur le chantier.",
		"built": [
			{
				"title": "Grille de planning",
				"body": "Salariés × créneaux × jours avec sauvegarde automatique ; indemnités de trajet calculées par zone via distance haversine et géocodage BAN."
			},
			{
				"title": "Un vrai multi-tenant",
				"body": "org_id sur chaque table, transactions scopées par requête, tests d’isolation pgTAP, branding et domaine personnalisés par tenant."
			},
			{
				"title": "Accès & audit",
				"body": "Profils personnalisés avec permissions par page, garde anti-escalade, journal d’audit complet, zxcvbn et une CSP stricte."
			},
			{
				"title": "Feuilles d’heures & PWA",
				"body": "Heures, repas et absences mensuels avec export CSV et impression A4 ; PWA installable avec onboarding guidé."
			}
		],
		"layers": [
			{
				"label": "Client",
				"value": "PWA React 19 · site vitrine statique"
			},
			{
				"label": "API",
				"value": "Express 5, sessions HttpOnly & RBAC"
			},
			{
				"label": "Données",
				"value": "PostgreSQL 17, 55 migrations, transactions scopées par tenant"
			},
			{
				"label": "Ops",
				"value": "VPS OVH, Caddy, prod/staging séparées, sauvegardes chiffrées chaque nuit"
			}
		],
		"metrics": [
			{
				"value": "55",
				"label": "migrations"
			},
			{
				"value": "3",
				"label": "formules"
			},
			{
				"value": "1",
				"label": "PWA, tous les écrans"
			}
		]
	},
	"ab2c": {
		"accent": "#8a9a5b",
		"link": "https://www.ab2c.pro",
		"stack": [
			"TanStack Start",
			"React 19",
			"Tailwind v4",
			"Payload 3",
			"PostgreSQL",
			"Zod",
			"Resend",
			"Brevo SMS",
			"PostHog",
			"Turborepo",
			"Coolify"
		],
		"cover": "ab2c-home",
		"gallery": [
			"ab2c-produits",
			"ab2c-documentation",
			"ab2c-contact"
		],
		"role": "Design system, site web & back-office",
		"period": "2026",
		"tagline": "Dessiné, pas tracé à la règle — une marque agricole au crayon.",
		"summary": "ab2c.pro : site, CRM et back-office pour AB2C, conseil en ensilage et environnement des élevages, distributeur exclusif MICROFERM pour la France, la Belgique, le Luxembourg et la Suisse.",
		"challenge": "Rendre humaine et digne de confiance une entreprise technique de l’agrofourniture, confier toutes les pages à un dirigeant non technique, et livrer par phases payantes sans rien réécrire entre elles.",
		"built": [
			{
				"title": "Design system dessiné à la main",
				"body": "Cadres, champs, boutons et carte de contact faits de traits de crayon générés et de SVG esquissés plutôt que de bordures et d’ombres."
			},
			{
				"title": "Un back-office pour un dirigeant non technique",
				"body": "Payload CMS 3 en deux côtés, site et clients : chaque page, FAQ, actualité et gamme de produits modifiable, avec une médiathèque qui montre où chaque image est utilisée."
			},
			{
				"title": "Documentation protégée par SMS",
				"body": "Les professionnels demandent l’accès, valident leur mobile par un code SMS, puis consultent fiches techniques et tarifs ; codes et crédits restants s’affichent sur l’écran clients."
			},
			{
				"title": "CRM, formulaires et audience",
				"body": "Server functions avec Zod, Turnstile et Resend qui alimentent un CRM intégré avec export CSV ; audience PostHog sans cookies, lue directement dans l’admin."
			}
		],
		"layers": [
			{
				"label": "Site",
				"value": "TanStack Start · React 19 · Tailwind v4"
			},
			{
				"label": "Admin",
				"value": "Payload CMS 3 sur PostgreSQL"
			},
			{
				"label": "Services",
				"value": "Resend · SMS Brevo · Turnstile · PostHog"
			},
			{
				"label": "Hébergement",
				"value": "Monorepo Turborepo, Docker sur VPS via Coolify, déploiement par release"
			}
		],
		"metrics": [
			{
				"value": "141",
				"label": "commits"
			},
			{
				"value": "13",
				"label": "releases"
			},
			{
				"value": "0",
				"label": "cookie"
			}
		]
	},
	"comacademy": {
		"accent": "#f2b632",
		"link": "https://comacademy.fr",
		"stack": [
			"Expo",
			"React Native",
			"Expo Router",
			"Strapi 5",
			"PostgreSQL",
			"React 19",
			"TanStack Query",
			"Vercel"
		],
		"cover": "comacademy-app",
		"gallery": [
			"comacademy-app3",
			"comacademy-backoffice",
			"comacademy-parcours"
		],
		"role": "Développeur mobile & full-stack",
		"period": "2023 — aujourd’hui",
		"tagline": "Apprendre la com’ et le marketing, cinq minutes par jour.",
		"summary": "App freemium iOS & Android pour apprendre la communication et le marketing — dictionnaire, fiches métiers, quiz, fil de contenus et défis hebdomadaires — avec un backend Strapi et un back office de 30 pages.",
		"challenge": "Faire revenir les apprenants chaque jour : des défis hebdo équitables pour ceux qui arrivent en milieu de semaine, un contenu premium qui convertit, et des paiements conformes aux stores sur les deux plateformes.",
		"built": [
			{
				"title": "Moteur de défis hebdo",
				"body": "Cinq défis quotidiens par semaine comptés depuis le début propre à chaque utilisateur, jours manqués débloqués pour les arrivants en cours de semaine, bonus à la clé."
			},
			{
				"title": "Achats in-app",
				"body": "react-native-iap avec reçus stockés dans Strapi et un service simulé pour faire tourner l’app dans Expo Go."
			},
			{
				"title": "Fil & engagement",
				"body": "Moteur de fil par snapshot et recyclage, likes, quiz, trophées, favoris et playlists."
			},
			{
				"title": "Back office",
				"body": "~30 pages React pour les contenus, les utilisateurs, les analytics et les modèles de notifications push."
			}
		],
		"layers": [
			{
				"label": "App",
				"value": "Expo / React Native sur iOS + Android"
			},
			{
				"label": "Back office",
				"value": "React 19 + Vite sur Vercel"
			},
			{
				"label": "API",
				"value": "Strapi 5 sur PostgreSQL, Docker"
			},
			{
				"label": "Distribution",
				"value": "App Store + Google Play via EAS"
			}
		],
		"metrics": [
			{
				"value": "2",
				"label": "stores"
			},
			{
				"value": "~30",
				"label": "pages de back office"
			},
			{
				"value": "v2.3",
				"label": "en production"
			}
		]
	},
	"asba": {
		"accent": "#d7e83a",
		"link": "https://asbadrums.com",
		"stack": [
			"React",
			"TypeScript",
			"TanStack Query",
			"Tailwind / SASS",
			"Strapi",
			"PostgreSQL",
			"Docker",
			"Vercel"
		],
		"cover": "asba-home",
		"gallery": [
			"asba-hero",
			"asba-product",
			"asba-leads"
		],
		"role": "Frontend, CMS & back office",
		"period": "2023 — aujourd’hui",
		"tagline": "Des batteries artisanales françaises, un site aussi puissant que les fûts.",
		"summary": "Site vitrine, catalogue et back office sur mesure pour ASBA, fabricant français de batteries artisanales — produits, finitions, artistes, carte des revendeurs et mini-CRM de suivi des leads.",
		"challenge": "Offrir à une petite marque artisanale une présence premium et éditoriale, avec un back office assez simple pour que les mises à jour ne cassent jamais le design.",
		"built": [
			{
				"title": "Catalogue produits",
				"body": "Endpoint Strapi sur mesure servant specs, nuanciers de finitions et galeries, filtrés et paginés."
			},
			{
				"title": "Back office intégré",
				"body": "Gestion des pages, produits, artistes, finitions, manifeste et pages légales directement dans l’app React."
			},
			{
				"title": "Leads & monitoring",
				"body": "Suivi des prospects alimentant un CRM interne, plus un moniteur de service sur les routes publiques."
			},
			{
				"title": "Ops durcies",
				"body": "Serveur OVH accessible uniquement par clé SSH avec UFW & Fail2ban, frontend sur Vercel, contrat de maintenance annuel."
			}
		],
		"layers": [],
		"metrics": []
	},
	"maison-du-print": {
		"accent": "#e0457b",
		"link": "https://lamaisonduprint.fr",
		"stack": [
			"Vue 3",
			"Vue Router",
			"Vite",
			"GSAP",
			"Swiper",
			"Sanity",
			"Vercel Functions",
			"sharp"
		],
		"cover": "print-v1",
		"gallery": [
			"print-v2",
			"print-v3",
			"print-v4",
			"print-v3-galerie"
		],
		"role": "Site, CMS & back office",
		"period": "2026",
		"tagline": "Un atelier de sérigraphie, avec un site aussi artisanal que l’encre.",
		"summary": "Site bilingue FR/EN pour un atelier indépendant de sérigraphie et d’impression textile DTF en Isère — services, devis et galerie de réalisations clients, contenus gérés via Sanity et un back office sur mesure.",
		"challenge": "Permettre à l’atelier de comparer quatre directions visuelles en ligne avant de trancher, puis de modifier textes et galerie en autonomie — sans lui imposer une interface CMS lourde.",
		"built": [
			{
				"title": "Quatre designs, une base de code",
				"body": "V1 à V4 livrées côte à côte derrière une barre de version ; la V4 sombre vit sur les mêmes URL et les anciens liens redirigent proprement."
			},
			{
				"title": "Sanity via l’API",
				"body": "Textes, médias et réalisations lus via des fonctions serverless ; un script de migration a poussé le contenu local vers Sanity."
			},
			{
				"title": "Un back office sur mesure",
				"body": "Textes, médias et tri de la galerie en glisser-déposer, sécurisés par des cookies de session HttpOnly signés HMAC — sans librairie d’authentification."
			},
			{
				"title": "Finitions Safari mobile",
				"body": "Zones sûres de la Dynamic Island, verrouillage du scroll, contournement de :has() non réévalué sur iOS, rechargement auto des onglets obsolètes après un déploiement, images optimisées avec sharp."
			}
		],
		"layers": [],
		"metrics": [
			{
				"value": "4",
				"label": "versions de design"
			},
			{
				"value": "2",
				"label": "langues"
			},
			{
				"value": "0",
				"label": "librairie d’auth"
			}
		]
	},
	"np-ebenisterie": {
		"accent": "#c8a24a",
		"link": null,
		"stack": [
			"Angular 20",
			"TypeScript",
			"Signals",
			"Zoneless",
			"Native CSS",
			"Vercel"
		],
		"cover": "np-home",
		"gallery": [
			"np-table",
			"np-table-detail",
			"np-process",
			"np-furniture"
		],
		"role": "Marque, site web — et les meubles",
		"period": "2026",
		"tagline": "Des meubles qui appartiennent à l’espace — faits main, livrés en Angular.",
		"summary": "Portfolio bilingue de mon propre atelier d’ébénisterie et de mobilier sur mesure autour de Lyon : tables rivière, entrées sur mesure, bureaux et petits objets, chaque pièce racontée comme une étude de cas.",
		"challenge": "Montrer le bois comme on le ressent en vrai — le fil, la lumière, l’échelle — tout en gardant un site statique, rapide et presque gratuit à héberger jusqu’à ce qu’un CMS se justifie.",
		"built": [
			{
				"title": "Angular 20, sans zone",
				"body": "Composants standalone, signals et détection de changements sans zone, vérifications de templates strictes ; CSS natif, aucune librairie de composants."
			},
			{
				"title": "Études de cas mobilier",
				"body": "Contenus projets typés et bilingues avec étapes de fabrication et galeries, plus une étagère de projets annexes pour planches à découper et expérimentations."
			},
			{
				"title": "Animations accessibles",
				"body": "Une directive de révélation au scroll réutilisable (IntersectionObserver) qui reste immobile pour ceux qui préfèrent réduire les animations."
			},
			{
				"title": "Marque & print",
				"body": "Le logo hexagonal décliné du site aux cartes de visite façon fil du bois ; un plan documenté Sanity + formulaire protégé pour la suite."
			}
		],
		"layers": [],
		"metrics": [
			{
				"value": "5",
				"label": "pièces documentées"
			},
			{
				"value": "2",
				"label": "langues"
			},
			{
				"value": "0",
				"label": "librairie UI"
			}
		]
	},
	"soulbm": {
		"accent": "#c2412d",
		"link": "https://soulbm.fr",
		"stack": [
			"React",
			"TanStack Router/Query",
			"Tailwind",
			"zod",
			"Strapi 5",
			"PostgreSQL",
			"Anthropic API"
		],
		"cover": "soulbm",
		"gallery": [
			"soulbm-events"
		],
		"role": "Président & développeur full-stack",
		"period": "2024 — aujourd’hui",
		"tagline": "Une association gérée comme une startup.",
		"summary": "Site public et back office complet pour l’association de parents d’élèves que je préside — trésorerie, événements, inventaire, tâches, inscriptions et journaux d’audit.",
		"challenge": "Les bénévoles changent chaque année. Les outils doivent être évidents dès le premier jour et garder une trace financière propre, sans comptable dans la pièce.",
		"built": [
			{
				"title": "Back office opérationnel",
				"body": "Plus de 30 types de contenus : trésorerie, répartition des dépenses par classe, tâches, événements, inventaires temporaires, rôles et journaux d’audit."
			},
			{
				"title": "Scan de tickets avec Claude",
				"body": "On photographie un ticket sur iPhone, le HEIC est converti côté serveur, les lignes sont extraites vers l’inventaire."
			},
			{
				"title": "App d’analytics",
				"body": "Dashboard séparé pour les pages vues, les erreurs et l’activité admin, en complément de PostHog."
			},
			{
				"title": "Auto-hébergé & durci",
				"body": "Strapi 5 sur Postgres 16 derrière Nginx/PM2 avec Let’s Encrypt, UFW et Fail2ban."
			}
		],
		"layers": [],
		"metrics": [
			{
				"value": "7",
				"label": "événements par an"
			},
			{
				"value": "900 €+",
				"label": "par classe"
			},
			{
				"value": "578",
				"label": "commits"
			}
		]
	},
	"fournelles": {
		"accent": "#b3263e",
		"link": "https://domainedesfournelles.com",
		"stack": [
			"React",
			"Vite",
			"Redux",
			"Sass",
			"Supabase",
			"Vercel Functions",
			"Resend"
		],
		"cover": "fournelles",
		"gallery": [
			"fournelles-shop",
			"fournelles-domaine",
			"fournelles-domain"
		],
		"role": "Site web & boutique",
		"period": "2022 — 2026",
		"tagline": "Le Beaujolais, servi dans le navigateur.",
		"summary": "Site web et parcours de commande pour un domaine viticole de Brouilly — refonte d’un site PHP de 2022 en React avec un espace admin sécurisé pour les vins, les étiquettes et les commandes.",
		"challenge": "Permettre à un domaine familial de mettre à jour ses vins et de prendre des commandes seul, sans jamais exposer de clé de service au navigateur.",
		"built": [
			{
				"title": "Les vins dans Supabase",
				"body": "Table protégée par RLS en lecture publique, seed JSON servant aussi de repli hors ligne."
			},
			{
				"title": "Admin verrouillé",
				"body": "Supabase Auth + liste d’emails autorisés, toutes les écritures passent par des fonctions Vercel."
			},
			{
				"title": "Parcours de commande",
				"body": "Emails de demande et de confirmation via Resend, upload des bouteilles et étiquettes dans Storage."
			}
		],
		"layers": [],
		"metrics": []
	},
	"careledger": {
		"accent": "#1f9d55",
		"link": null,
		"stack": [
			"Next.js 16",
			"React 19",
			"Drizzle",
			"PostgreSQL",
			"Tailwind v4",
			"Docker",
			"node:test"
		],
		"cover": "careledger-overview",
		"gallery": [
			"careledger-portfolio",
			"careledger-flow"
		],
		"role": "Outil perso — conception & développement",
		"period": "2026",
		"tagline": "Contrats de maintenance, heures et infra — un seul registre.",
		"summary": "Outil local-first pour suivre mes contrats de maintenance freelance : forfaits, temps passé, et un dossier par client couvrant l’infrastructure, les coûts, les décisions et le déploiement.",
		"challenge": "Savoir d’un coup d’œil quel client dépasse son forfait, combien coûte sa stack par mois et comment la déployer — sans abonnement SaaS.",
		"built": [
			{
				"title": "Forfaits de contrat",
				"body": "Périodes mensuelles à contrat entier ; heures incluses, évolutions, sécurité et travail non facturé."
			},
			{
				"title": "Un chrono qui résiste",
				"body": "Le chrono de tâche survit aux redémarrages, suppressions réversibles, historique d’édition horodaté."
			},
			{
				"title": "Dossiers projet",
				"body": "Infra, coûts récurrents, phases, décisions, schémas de déploiement et carte — les secrets sont refusés par conception."
			}
		],
		"layers": [],
		"metrics": []
	}
};
