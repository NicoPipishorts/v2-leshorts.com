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
		"cover": "synqit-home",
		"gallery": [
			"synqit-dashboard-dark",
			"synqit-events",
			"synqit-transfer-dark",
			"synqit-phone-guest",
			"synqit-phone-guest-tracks-dark",
			"synqit-phone-share",
			"synqit-phone-dashboard-dark",
			"synqit-phone-transfer"
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
		"cover": "horizon-planning",
		"gallery": [
			"horizon-affectation",
			"horizon-chantiers",
			"horizon-suivi",
			"horizon-phone-planning",
			"horizon-phone-chantier",
			"horizon-phone-affectation",
			"horizon-phone-suivi",
			"horizon-phone-chantiers"
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
			"ab2c-services",
			"ab2c-clients-dark",
			"ab2c-demandes",
			"ab2c-m-home",
			"ab2c-m-services",
			"ab2c-m-produits",
			"ab2c-m-expertise",
			"ab2c-m-documentation"
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
		"cover": "comacademy-home",
		"gallery": [
			"comacademy-backoffice",
			"comacademy-parcours",
			"comacademy-question",
			"comacademy-m-accueil",
			"comacademy-m-jeu",
			"comacademy-m-secrets",
			"comacademy-m-feed",
			"comacademy-m-dico"
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
			"asba-kits",
			"asba-leads",
			"asba-lead",
			"asba-m-home",
			"asba-m-kits",
			"asba-m-produit",
			"asba-m-custom",
			"asba-m-artistes",
			"asba-m-manifeste"
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
			"print-atelier",
			"print-galerie",
			"print-devis",
			"print-m-home",
			"print-m-services",
			"print-m-atelier",
			"print-m-galerie",
			"print-m-devis"
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
			"np-realisations",
			"np-projet",
			"np-methode",
			"np-m-home",
			"np-m-realisations",
			"np-m-projet",
			"np-m-methode",
			"np-m-contact"
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
		"cover": "soulbm-accueil",
		"gallery": [
			"soulbm-admin-planning",
			"soulbm-admin-tresorerie",
			"soulbm-admin-adherents"
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
			"fournelles-vins",
			"fournelles-m-home",
			"fournelles-m-domaine",
			"fournelles-m-vins",
			"fournelles-m-fiche",
			"fournelles-m-boutique"
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
			"careledger-project",
			"careledger-flow",
			"careledger-worklog"
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
	},
	"arthur": {
		"accent": "#1b73be",
		"link": "https://www.arthurskiandbike.com",
		"stack": [
			"Next.js 16",
			"React 19",
			"TypeScript",
			"Tailwind v4",
			"Sanity",
			"Resend",
			"Vercel"
		],
		"cover": "arthur-home",
		"gallery": [
			"arthur-activite",
			"arthur-admin-activites",
			"arthur-admin-programme",
			"arthur-m-home",
			"arthur-m-offre",
			"arthur-m-activite",
			"arthur-m-programme",
			"arthur-m-tarifs"
		],
		"role": "Design & développement",
		"period": "Juin — octobre 2026",
		"tagline": "Toute l'année en montagne, et un site qu'il met à jour lui-même.",
		"summary": "Arthur est moniteur de ski et guide VTT dans la vallée des Belleville. Son site présente ses cours, sorties, séjours et tarifs, hiver comme été, et renvoie vers WhatsApp ou un formulaire : pas de paiement en ligne, il répond lui-même à chaque demande. Derrière, une admin faite sur mesure lui permet de modifier chaque page sans passer par un CMS.",
		"challenge": "Donner à un moniteur qui passe ses journées sur les pistes un site qui vend du plaisir plutôt que du risque, et une admin assez simple pour qu'il la tienne seul entre deux sorties.",
		"built": [
			{
				"title": "Offre et programme",
				"body": "Activités classées par saison et regroupées en catégories, calendrier des départs où chaque séjour mène à sa fiche ; les départs à pousser ressortent en couleur."
			},
			{
				"title": "Admin sur mesure",
				"body": "Un back-office maison au-dessus de Sanity : un éditeur par page, glisser-déposer pour l'ordre des cartes, aperçu avant publication et confirmations claires."
			},
			{
				"title": "Photos sans friction",
				"body": "Les photos du téléphone sont réduites dans le navigateur avant l'envoi pour passer sous la limite de Vercel, avec un cadrage réglable pour chaque image d'en-tête."
			},
			{
				"title": "Contact & référencement",
				"body": "Formulaire validé champ par champ et envoyé par Resend ; domaine définitif, canoniques, Open Graph et données structurées pour Google."
			}
		],
		"layers": [
			{
				"label": "Client",
				"value": "Next.js 16 · React 19 · Tailwind v4"
			},
			{
				"label": "API",
				"value": "Server Actions et route de contact, session admin signée (JWT)"
			},
			{
				"label": "Données",
				"value": "Sanity — contenus et images"
			},
			{
				"label": "Ops",
				"value": "Vercel · Resend · typecheck et build en CI GitHub Actions"
			}
		],
		"metrics": [
			{
				"value": "10",
				"label": "pages éditables depuis l'admin"
			}
		]
	},
	"oxid": {
		"accent": "#12a597",
		"link": "https://www.oxidstudio.fr",
		"stack": [
			"TanStack Start",
			"React 19",
			"Vite",
			"Tailwind v4",
			"Nitro",
			"PostHog",
			"Resend",
			"Cloudflare Turnstile",
			"Vercel"
		],
		"cover": "oxid-hero",
		"gallery": [
			"oxid-growth",
			"oxid-cards",
			"oxid-portfolio",
			"oxid-m-hero",
			"oxid-m-growth",
			"oxid-m-features",
			"oxid-m-cards",
			"oxid-m-portfolio"
		],
		"role": "Fondateur & développement",
		"period": "Octobre 2026",
		"tagline": "Du prompt au produit : finir ce que l'IA a commencé.",
		"summary": "Oxid Studio s'adresse à ceux qui ont monté une app avec l'IA ou du no-code et doivent la rendre utilisable : sécurité, mise en ligne, design, branding. Le site déroule l'offre en quatre étapes, de l'usage privé au SaaS, montre les projets livrés et recueille les demandes.",
		"challenge": "Faire comprendre une offre plutôt abstraite par l'interaction — des cartes qui s'ouvrent, une sphère qui réagit au pointeur — sans rien céder sur la vitesse, l'accessibilité ou la vie privée des visiteurs.",
		"built": [
			{
				"title": "Fidèle à la maquette",
				"body": "Intégration du fichier Figma : variables et styles de texte repris tels quels, typographie fluide, thèmes sombre et clair."
			},
			{
				"title": "Des cartes qui s'animent",
				"body": "Cadenas qui s'ouvre, goutte de peinture qui roule, anneau qui éclate : une animation par carte, avec une version allégée pour Safari et pour le mouvement réduit."
			},
			{
				"title": "Mesure respectueuse",
				"body": "PostHog hébergé en Europe, sans cookie tant que le visiteur n'a pas accepté, relayé par le domaine du site ; erreurs suivies côté navigateur et routeur."
			},
			{
				"title": "Formulaire protégé",
				"body": "Envoi par Resend avec des mails aux couleurs du studio, derrière quatre barrières anti-spam : champ piège, temps de saisie, limite par IP et Turnstile."
			}
		],
		"layers": [
			{
				"label": "Client",
				"value": "TanStack Start · React 19 · Tailwind v4"
			},
			{
				"label": "API",
				"value": "Fonctions serveur TanStack sur Nitro"
			},
			{
				"label": "Ops",
				"value": "Vercel · Resend · PostHog EU · Cloudflare Turnstile"
			}
		],
		"metrics": []
	}
};

// Portrait shots (phone screens, upright photos): shown in their own gallery row at their real ratio.
window.TALL_SHOTS = new Set(["ab2c-m-documentation", "ab2c-m-expertise", "ab2c-m-home", "ab2c-m-produits", "ab2c-m-services", "arthur-m-activite", "arthur-m-home", "arthur-m-offre", "arthur-m-programme", "arthur-m-tarifs", "asba-m-artistes", "asba-m-custom", "asba-m-home", "asba-m-kits", "asba-m-manifeste", "asba-m-produit", "comacademy-m-accueil", "comacademy-m-dico", "comacademy-m-feed", "comacademy-m-jeu", "comacademy-m-secrets", "fournelles-m-boutique", "fournelles-m-domaine", "fournelles-m-fiche", "fournelles-m-home", "fournelles-m-vins", "horizon-phone-affectation", "horizon-phone-chantier", "horizon-phone-chantiers", "horizon-phone-planning", "horizon-phone-suivi", "np-m-contact", "np-m-home", "np-m-methode", "np-m-projet", "np-m-realisations", "oxid-m-cards", "oxid-m-features", "oxid-m-growth", "oxid-m-hero", "oxid-m-portfolio", "print-m-atelier", "print-m-devis", "print-m-galerie", "print-m-home", "print-m-services", "synqit-phone-dashboard-dark", "synqit-phone-guest", "synqit-phone-guest-tracks-dark", "synqit-phone-share", "synqit-phone-transfer"]);

// Dark screenshots get a light frame in the gallery (light ones a dark one).
window.DARK_SHOTS = new Set(["ab2c-clients-dark", "asba-m-custom", "asba-m-kits", "asba-m-manifeste", "asba-m-produit", "fournelles-domaine", "fournelles-m-fiche", "fournelles-m-vins", "fournelles-vins", "np-m-home", "oxid-cards", "oxid-growth", "oxid-m-cards", "oxid-m-growth", "oxid-m-hero", "synqit-dashboard-dark", "synqit-phone-dashboard-dark", "synqit-phone-guest-tracks-dark", "synqit-transfer-dark"]);

// Gallery captions for the project page's lightbox: shot name → [title, description].
window.CAPTIONS = {
	"kaast-player": ["Le lecteur vidéo", "Le lecteur de Kaast avec ses panneaux description et langue, ouverts sans quitter la vidéo."],
	"comacademy-backoffice": ["Tableau de bord", "Le back office résume le catalogue (questions, dico, citations, vidéos) et les derniers inscrits, ici avec des comptes fictifs."],
	"comacademy-parcours": ["Parcours", "Les stocks de contenus qui alimentent les semaines du parcours, et le pool qui bloquera la prochaine."],
	"asba-kits": ["Catalogue des batteries", "Chaque kit en grand visuel, un clic pour ouvrir sa fiche."],
	"asba-leads": ["Leads", "Toutes les demandes du site dans l’admin : type, statut de l’e-mail, configuration proposée et dernier contact (données fictives)."],
	"fournelles-shop": ["Demande de commande", "Les cuvées s'ajoutent au panier ; le domaine répond avec les délais et les frais de livraison."],
	"fournelles-domaine": ["Le domaine", "Trois générations de vignerons racontées à côté d'une galerie photo du vignoble."],
	"careledger-flow": ["Architecture et coûts", "Le parcours du visiteur jusqu'aux sauvegardes, avec le coût de chaque brique."],
	"print-atelier": ["L'atelier", "L'histoire de l'atelier racontée en grand, photos posées comme des tirages scotchés au mur."],
	"print-galerie": ["La galerie", "Les réalisations de l'atelier, filtrées par technique : sérigraphie ou impression DTF."],
	"print-devis": ["La demande de devis", "Un formulaire court, avec le type d'impression, le textile, la quantité et le visuel à joindre."],
	"print-m-home": ["L'accueil sur mobile", "La même affiche typographique, recomposée pour le téléphone."],
	"print-m-services": ["Ce que fait l'atelier", "Le bandeau défilant et les services, à la suite de l'accueil."],
	"print-m-atelier": ["L'atelier sur mobile", "Les photos de l'atelier et son histoire, lues d'une traite au pouce."],
	"print-m-galerie": ["La galerie sur mobile", "Les filtres restent à portée de main au-dessus des réalisations."],
	"print-m-devis": ["Le devis sur mobile", "Le formulaire de devis, pensé pour être rempli depuis un téléphone."],
	"soulbm-admin-planning": ["Le planning", "Le calendrier du bureau : tâches, échéances et réunions privées, rattachées à chaque événement."],
	"soulbm-admin-tresorerie": ["La trésorerie", "Recettes, dépenses et virements de l'année, avec les remboursements à faire mis en avant."],
	"soulbm-admin-adherents": ["Les adhérents", "Le registre des adhésions, synchronisé avec HelloAsso et complété par les saisies manuelles."],
	"ab2c-services": ["Services", "Trois métiers présentés page par page, du conseil sur le terrain à la direction commerciale à temps partagé."],
	"ab2c-m-home": ["Accueil mobile", "L’offre lisible dès le premier écran, sur la photo d’une prairie fauchée."],
	"ab2c-m-services": ["Services", "Des titres larges et une photo de terrain pour chaque accompagnement."],
	"ab2c-m-produits": ["Produits", "Les deux marques distribuées, MICROFERM et Silostop, et le rôle de chacune."],
	"ab2c-m-expertise": ["Expertise", "Fourrages, effluents et performance économique, expliqués sans jargon."],
	"arthur-activite": ["Fiche activité", "Une sortie hors-piste : durée, niveau, terrain et tarif d'un coup d'œil."],
	"arthur-admin-activites": ["Admin · Activités", "Les cartes se réordonnent au glisser-déposer, filtrées par saison."],
	"arthur-admin-programme": ["Admin · Programme", "Le calendrier des départs : on clique deux dates pour créer un séjour."],
	"arthur-m-home": ["Accueil sur mobile", "Le même hero, recadré pour le téléphone."],
	"arthur-m-offre": ["Cours & sorties", "Les cartes passent sur deux colonnes compactes, onglets hiver et été."],
	"arthur-m-activite": ["Fiche sur mobile", "Titre, description et repères pratiques, lisibles sans zoomer."],
	"arthur-m-programme": ["Programme", "Les prochains départs et leurs places ; un séjour mis en avant en rouge."],
	"arthur-m-tarifs": ["Tarifs", "Matin, grand matin, après-midi, journée : des fourchettes claires."],
	"oxid-growth": ["Quatre étapes", "De l'usage privé au produit SaaS, une carte par étape."],
	"oxid-cards": ["Ce qui manque", "Paiement, marque, montée en charge, sécurité : des cartes qui s'ouvrent au clic."],
	"oxid-portfolio": ["Réalisations", "Les projets livrés, chacun avec sa page détaillée."],
	"oxid-m-hero": ["Accueil sur mobile", "L'accroche et le bouton Démarrer, tenus sur un écran."],
	"oxid-m-growth": ["Étapes sur mobile", "Les cartes d'étape s'empilent, halo compris."],
	"oxid-m-features": ["Le constat", "L'IA a levé la barrière de la création ; reste à publier, protéger, faire grandir."],
	"oxid-m-cards": ["Cartes sur mobile", "Le carrousel se fait défiler du pouce, une carte à la fois."],
	"oxid-m-portfolio": ["Réalisations sur mobile", "Chaque projet livré, avec son lien vers l'étude de cas."],
	"ab2c-m-documentation": ["Documentation", "Fiches techniques et tarifs réservés aux professionnels, accessibles par lien et code SMS."],
	"asba-lead": ["Fiche lead", "Le message, l’historique des appels et e-mails, les notes internes et le devis proposé sur un seul écran."],
	"asba-m-home": ["Accueil mobile", "Le carrousel d’accueil met en avant les collaborations avec les artistes."],
	"asba-m-kits": ["Choisis ton kit", "Le catalogue en plein écran, pensé pour le pouce."],
	"asba-m-produit": ["Fiche produit", "La série Fantôme en ouverture, avec l’appel à commander."],
	"asba-m-custom": ["Custom shop", "L’entrée vers les instruments sur mesure."],
	"asba-m-artistes": ["Artist family", "Les batteurs qui jouent ASBA, chacun avec sa page."],
	"asba-m-manifeste": ["Manifeste", "Le parti pris de la marque sur les matériaux et le savoir-faire."],
	"horizon-affectation": ["L'affectation", "Une demi-journée se règle en une fenêtre : chantier, dépôt ou absence, et la période d'intervention qui va avec."],
	"horizon-chantiers": ["La rentabilité des chantiers", "Devis, facturé, coûts et marge de chaque chantier, avec le chiffre d'affaires mensuel et le coefficient global."],
	"horizon-suivi": ["La feuille de suivi", "Le récapitulatif mensuel d'un salarié, calculé depuis le planning : heures, paniers, distances, congés et jours fériés."],
	"horizon-phone-planning": ["Le planning sur téléphone", "La semaine de toute l'équipe en abrégé, matin et après-midi, avec les disponibilités et les conflits signalés."],
	"horizon-phone-chantier": ["La fiche du créneau", "Sur le chantier, un appui ouvre l'adresse, l'itinéraire, la distance depuis le dépôt et la période prévue."],
	"horizon-phone-affectation": ["Modifier depuis le terrain", "Le chef d'équipe change une affectation ou une période directement depuis son téléphone."],
	"horizon-phone-suivi": ["Le suivi mensuel mobile", "Les totaux du mois d'un salarié, puis le détail jour par jour, lisibles sans ordinateur."],
	"horizon-phone-chantiers": ["Les chiffres en poche", "Devis, facturé, coûts et marge de l'entreprise, consultables entre deux chantiers."],
	"synqit-phone-guest": ["Ajouter un morceau", "La page invité, pensée pour le téléphone : on cherche un titre et on l'ajoute, sans compte ni application."],
	"synqit-phone-share": ["Le lien d'invitation", "L'hôte partage un seul lien par message, WhatsApp ou e-mail, et peut le révoquer ou le régénérer à tout moment."],
	"synqit-phone-transfer": ["Le suivi du transfert", "Le résultat d'un transfert entre services, consultable depuis le téléphone, titre par titre."],
	"careledger-project": ["Fiche projet", "Contrat, heures consommées, fonctionnalités restantes et tendance de charge sur six mois."],
	"careledger-worklog": ["Journal de travail", "Chaque tâche rattachée à son client, son contrat et son mode de facturation."],
	"fournelles-vins": ["Fiche de dégustation", "Chaque cuvée a son commentaire de dégustation et ses accords mets et vins."],
	"fournelles-m-home": ["Accueil mobile", "La vidéo du vignoble en plein écran, avec le logo du domaine."],
	"fournelles-m-domaine": ["Histoire sur mobile", "Le récit du domaine reste lisible sur la photo, la navigation passe en bas d'écran."],
	"fournelles-m-vins": ["Les cuvées", "Un carrousel de bouteilles à faire défiler du pouce."],
	"fournelles-m-fiche": ["Fiche cuvée", "Dégustation et accords mets et vins, cuvée par cuvée."],
	"fournelles-m-boutique": ["Panier mobile", "Une carte par cuvée, avec format et bouton d'ajout au panier."],
	"np-realisations": ["Réalisations", "Chaque meuble présenté par son lieu, son année et une phrase qui résume le projet."],
	"np-projet": ["Étude de cas", "Une page par projet : matériaux, lieu, résumé en un coup d'œil puis le détail de fabrication."],
	"np-methode": ["La méthode", "Du premier échange à la pose, les étapes d'un projet sur mesure expliquées simplement."],
	"np-m-home": ["Accueil mobile", "La promesse en grand sur une photo de plateau en frêne et wengé."],
	"np-m-realisations": ["Projets sur mobile", "La liste des réalisations en cartes, photo d'abord."],
	"np-m-projet": ["Projet sur mobile", "Titre, matériaux et lieu avant les photos du meuble posé."],
	"np-m-methode": ["Méthode sur mobile", "Les trois étapes lisibles d'un pouce : comprendre, proposer, réaliser."],
	"np-m-contact": ["Demande de projet", "Un formulaire court, avec e-mail et téléphone pour écrire directement."],
	"comacademy-question": ["Fiche question", "Chaque question du jeu vrai ou faux : réponse, explication détaillée, catégories et statut de publication."],
	"comacademy-m-accueil": ["Accueil de l’app", "Les rubriques en tuiles, du jeu aux 10 commandements, et le contenu à la une."],
	"comacademy-m-jeu": ["Le jeu", "Une partie de vrai ou faux se lance d’un geste ; le mode Réponses permet de réviser."],
	"comacademy-m-secrets": ["3 secrets du succès", "Les secrets d’une marque racontés en cartes à faire défiler."],
	"comacademy-m-feed": ["Feed", "Un fil quotidien qui mélange métiers, questions du jeu et actus de la com."],
	"comacademy-m-dico": ["Dico", "Le jargon de la com de A à Z, avec recherche et index alphabétique."],
	"ab2c-clients-dark": ["Espace clients", "L’écran d’accueil du back office : demandes à traiter, chiffres du mois et accès rapides, avec des données fictives. En mode sombre."],
	"synqit-dashboard-dark": ["Le tableau de bord", "L'espace de l'hôte : événements en cours, abonnés, titres ajoutés dans la journée et activité des invités en direct. En mode sombre."],
	"synqit-transfer-dark": ["Le transfert", "Une playlist passe de Spotify à Apple Music titre par titre, avec le détail de ce qui a été retrouvé ou non. En mode sombre."],
	"ab2c-demandes": ["Demandes", "Chaque formulaire du site arrive ici avec son type et son statut, pour savoir où en est chaque échange."],
	"synqit-events": ["Les événements", "Chaque fête a sa playlist, ouverte ou fermée, avec son lien invité et son partage en un clic."],
	"synqit-phone-guest-tracks-dark": ["La playlist commune", "Les invités voient la liste se remplir au fil de la soirée, numérotée dans l'ordre des ajouts. En mode sombre."],
	"synqit-phone-dashboard-dark": ["Le tableau de bord mobile", "Les mêmes chiffres que sur ordinateur, avec une barre de navigation flottante à portée de pouce. En mode sombre."],
};
