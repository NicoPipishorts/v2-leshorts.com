// Renders each case study to full HTML: redesign/project.html is the template, projects.js + project-data.js
// the data (loaded as the browser loads them, into a sandbox). Crawlers and link previews get the whole page,
// with its own title, description, canonical, OG/Twitter tags and JSON-LD; the page's script only adds the lightbox.
// Used by scripts/build-site.mjs (dist/portfolio/<slug>.html) and scripts/dev.mjs (per request).
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "redesign");
export const SITE = "https://www.nicolaspisar.com";

// Read fresh each call, so the dev server shows edits without a restart.
export function loadProjects() {
	const ctx = vm.createContext({});
	ctx.window = ctx;
	for (const f of ["projects.js", "project-data.js"]) vm.runInContext(fs.readFileSync(path.join(SRC, f), "utf8"), ctx, { filename: f });
	return ctx;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

// The full page for one project, or null for an unknown slug.
export function renderProject(slug, data = loadProjects()) {
	const { PROJECTS, DETAILS, CAPTIONS, TALL_SHOTS, DARK_SHOTS, CATS, inkOn, shot, projectUrl } = data;
	const i = PROJECTS.findIndex((p) => p.slug === slug);
	if (i < 0 || !DETAILS[slug]) return null;
	const p = { ...PROJECTS[i], ...DETAILS[slug] };
	const next = PROJECTS[(i + 1) % PROJECTS.length];
	const hex = (q, cls = "") => `<span class="hx ${cls}" style="--c:${DETAILS[q.slug].accent};--t:${inkOn(DETAILS[q.slug].accent)}" aria-hidden="true">${q.ini}</span>`;
	const cap = (g) => CAPTIONS[g] || [p.name, ""];
	// Gallery: desktop screens share one row at one ratio; phone screens and portrait photos get their own row.
	const row = (tall) => {
		const items = p.gallery.map((g, i) => [g, i]).filter(([g]) => TALL_SHOTS.has(g) === tall);
		return items.length ? `<div class="g-row ${tall ? "tall" : "wide"}">${items.map(([g, i]) => `<a href="${shot(g)}" data-i="${i}" data-d="${esc(cap(g)[1])}" data-tone="${DARK_SHOTS.has(g) ? "dark" : "light"}"><img src="${shot(g)}" alt="${esc(cap(g)[0])}" loading="lazy" /></a>`).join("")}</div>` : "";
	};
	const sec = (label, title, body, cls = "") => `<section class="wrap ${cls}"><div class="head"><div><span class="mono">${label}</span><h2>${title}</h2></div></div>${body}</section>`;

	const head = `
		<nav class="crumbs mono" aria-label="Fil d'Ariane"><a href="/portfolio">Projets</a><span>/</span><span>${esc(p.name)}</span></nav>
		<div class="case-title">${hex(p, "big")}<div><span class="mono">${esc(p.kind)} · ${p.period}</span><h1>${esc(p.name)}</h1></div></div>
		<p class="lede">${esc(p.tagline)}</p>
		<dl class="facts">
			<div><dt class="mono">Rôle</dt><dd>${esc(p.role)}</dd></div>
			<div><dt class="mono">Période</dt><dd>${p.period}</dd></div>
			<div><dt class="mono">Type</dt><dd>${CATS[p.cat]}</dd></div>
			<div><dt class="mono">En ligne</dt><dd>${p.link ? `<a class="ext-link" href="${p.link}" target="_blank" rel="noopener">${p.link.replace(/^https?:\/\//, "")} <span class="ic ext" aria-hidden="true"></span></a>` : "Privé"}</dd></div>
		</dl>`;

	const main = `
		<div class="wrap cover"><img src="${shot(p.cover)}" alt="${esc(p.name)}, page principale" /></div>
		${p.metrics.length ? `<div class="wrap"><div class="metrics">${p.metrics.map((m) => `<div><b>${m.value}</b><span>${esc(m.label)}</span></div>`).join("")}</div></div>` : ""}
		<section class="wrap overview">
			<div><span class="mono">Aperçu</span><p>${esc(p.summary)}</p></div>
			<div class="challenge"><span class="mono">Le défi</span><p>${esc(p.challenge)}</p></div>
		</section>
		${sec("Ce que j'ai construit", "Les briques du projet", `<div class="built">${p.built.map((b) => `<article><h3>${esc(b.title)}</h3><p>${esc(b.body)}</p></article>`).join("")}</div>`)}
		${p.layers.length ? sec("Architecture", "Comment c'est assemblé", `<dl class="layers">${p.layers.map((l) => `<div><dt class="mono">${esc(l.label)}</dt><dd>${esc(l.value)}</dd></div>`).join("")}</dl>`) : ""}
		${p.gallery.length ? sec("Écrans", "En images", `<div class="gallery">${row(false)}${row(true)}</div>`) : ""}
		${sec("Stack", "Les outils", `<ul class="chips big">${p.stack.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`)}
		<div class="wrap"><a class="next" href="${projectUrl(next.slug)}">
			<span class="mono">Projet suivant</span>
			<span class="next-row">${hex(next)}<span><b>${esc(next.name)}</b><span>${esc(next.line)}</span></span><span class="arr" aria-hidden="true"><span class="ic"></span></span></span>
		</a></div>`;

	const url = `${SITE}${projectUrl(slug)}`, image = `${SITE}${shot(p.cover)}`;
	const title = `${p.name} · ${p.kind} | Nicolas Pisar`, desc = p.line;
	const ld = {
		"@context": "https://schema.org", "@type": "CreativeWork", name: p.name, headline: title, description: desc, url, image,
		inLanguage: "fr", genre: p.kind, keywords: p.stack.join(", "), ...(p.link && { sameAs: p.link }),
		author: { "@type": "Person", "@id": `${SITE}/#nicolas`, name: "Nicolas Pisar", url: `${SITE}/` },
	};
	const meta = `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Nicolas Pisar · leshorts.com" />
<meta property="og:locale" content="fr_FR" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:image" content="${image}" />
<meta property="og:image:alt" content="${esc(p.name)}, page principale" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(desc)}" />
<meta name="twitter:image" content="${image}" />
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`;

	const tpl = fs.readFileSync(path.join(SRC, "project.html"), "utf8");
	const slots = [/<title>.*<\/title>/, '<div class="wrap pagehead case-head" id="head"></div>', '<main id="case"></main>'];
	if (!slots.every((s) => tpl.search(s) >= 0)) throw new Error("project.html lost its <title>, #head or #case placeholder");
	return tpl
		.replace(slots[0], () => meta)
		.replace(slots[1], () => `<div class="wrap pagehead case-head" id="head">${head}</div>`)
		.replace(slots[2], () => `<main id="case">${main}</main>`);
}
