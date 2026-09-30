// Branded HTML emails for the contact form: a notification to Nicolas and a confirmation to the visitor.
// Table layout + inline styles because email clients ignore most modern CSS.

const C = { bg: "#0b0c0f", card: "#14161b", fg: "#f1ece4", muted: "#9a9ca3", line: "#26282e", coral: "#dc5c48" };
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export const escapeHtml = (s) =>
	String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const button = (href, label) =>
	`<a href="${escapeHtml(href)}" style="display:inline-block;background:${C.coral};color:${C.bg};font:700 13px ${FONT};letter-spacing:.14em;text-transform:uppercase;text-decoration:none;padding:14px 26px;border-radius:999px">${escapeHtml(label)}</a>`;

/** Shared shell: dark page, coral wordmark, card, small footer. `preheader` is the inbox preview line. */
const layout = ({ preheader, body, footer, lang }) => `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title></title></head>
<body style="margin:0;padding:0;background:${C.bg}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}">
<tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 4px 20px;font:800 13px ${FONT};letter-spacing:.28em;text-transform:uppercase;color:${C.fg}">
<span style="color:${C.coral}">&#11042;</span>&nbsp; Nicolas Pisar</td></tr>
<tr><td style="background:${C.card};border:1px solid ${C.line};border-top:3px solid ${C.coral};border-radius:18px;padding:32px 28px;font:16px/1.6 ${FONT};color:${C.fg}">
${body}
</td></tr>
<tr><td style="padding:20px 4px 0;font:12px/1.6 ${FONT};color:${C.muted}">${footer}</td></tr>
</table></td></tr></table></body></html>`;

const label = (s) => `<div style="font:700 11px ${FONT};letter-spacing:.2em;text-transform:uppercase;color:${C.muted}">${s}</div>`;

/** To Nicolas. All visitor input is escaped. */
export const notificationEmail = ({ name, email, topic, message, lang, siteUrl, sentAt = new Date() }) => {
	const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Paris" }).format(sentAt);
	const reply = `mailto:${email}?subject=${encodeURIComponent(`Re: ${topic || "your message"}`)}`;
	const rows = [
		["From", `${escapeHtml(name)} &lt;<a href="mailto:${escapeHtml(email)}" style="color:${C.coral}">${escapeHtml(email)}</a>&gt;`],
		["Topic", escapeHtml(topic || "—")],
		["Language", lang === "fr" ? "Français" : "English"],
		["Sent", `${when} (Paris)`],
	]
		.map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;vertical-align:top;white-space:nowrap">${label(k)}</td><td style="padding:6px 0;font:15px/1.5 ${FONT};color:${C.fg}">${v}</td></tr>`)
		.join("");

	return {
		subject: `[Portfolio] ${topic || "Contact"} — ${name}`,
		html: layout({
			lang: "en",
			preheader: `${topic || "New message"} — ${name}: ${message.slice(0, 90)}`,
			body: `${label("New message")}
<h1 style="margin:8px 0 22px;font:800 26px/1.2 ${FONT};color:${C.fg}">${escapeHtml(name)} wants to talk.</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:22px">${rows}</table>
<div style="border-left:3px solid ${C.coral};background:${C.bg};border-radius:0 12px 12px 0;padding:16px 18px;font:16px/1.65 ${FONT};color:${C.fg};white-space:pre-wrap">${escapeHtml(message)}</div>
<div style="margin-top:26px">${button(reply, `Reply to ${name.split(" ")[0]}`)}</div>`,
			footer: `Sent from the contact form on <a href="${escapeHtml(siteUrl)}" style="color:${C.muted}">${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}</a>. Hitting reply goes straight to the sender.`,
		}),
		text: `New message from ${name} <${email}>\nTopic: ${topic || "—"}\nLanguage: ${lang}\nSent: ${when} (Paris)\n\n${message}\n`,
	};
};

const COPY = {
	en: {
		subject: (n) => `Thanks for reaching out, ${n}`,
		preheader: "Your message landed safely — I usually reply within a day.",
		title: (n) => `Thanks, ${n}.`,
		body: "Your message landed safely in my inbox. I read everything myself and usually reply within a day — often sooner.",
		body2: "In the meantime, feel free to look around a few more case studies.",
		cta: "See the work",
		sign: "Talk soon,",
		footer: (site) => `You’re receiving this because this address was entered in the contact form on ${site}. If that wasn’t you, you can safely ignore this email.`,
	},
	fr: {
		subject: (n) => `Merci pour votre message, ${n}`,
		preheader: "Votre message est bien arrivé — je réponds en général sous 24 h.",
		title: (n) => `Merci, ${n}.`,
		body: "Votre message est bien arrivé. Je lis tout moi-même et je réponds en général sous 24 h — souvent plus vite.",
		body2: "En attendant, n’hésitez pas à parcourir quelques études de cas.",
		cta: "Voir les projets",
		sign: "À très vite,",
		footer: (site) => `Vous recevez cet email car cette adresse a été saisie dans le formulaire de contact de ${site}. Si ce n’était pas vous, ignorez simplement ce message.`,
	},
};

/**
 * To the visitor, in their language. Deliberately does NOT echo their message:
 * otherwise the form could be abused to send arbitrary text to any address from our domain.
 */
export const confirmationEmail = ({ name, lang, siteUrl }) => {
	const t = COPY[lang === "fr" ? "fr" : "en"];
	const first = name.split(" ")[0].slice(0, 40);
	const site = siteUrl.replace(/^https?:\/\//, "");
	return {
		subject: t.subject(first),
		html: layout({
			lang: lang === "fr" ? "fr" : "en",
			preheader: t.preheader,
			body: `<h1 style="margin:0 0 16px;font:800 28px/1.2 ${FONT};color:${C.fg}">${escapeHtml(t.title(first))}</h1>
<p style="margin:0 0 14px">${t.body}</p>
<p style="margin:0 0 26px;color:${C.muted}">${t.body2}</p>
${button(siteUrl, t.cta)}
<p style="margin:28px 0 0">${t.sign}<br><strong>Nicolas</strong><br><span style="color:${C.muted};font-size:14px">Senior Frontend Engineer · Isère, France</span></p>`,
			footer: escapeHtml(t.footer(site)),
		}),
		text: `${t.title(first)}\n\n${t.body}\n${t.body2}\n${siteUrl}\n\n${t.sign}\nNicolas\n\n${t.footer(site)}\n`,
	};
};
