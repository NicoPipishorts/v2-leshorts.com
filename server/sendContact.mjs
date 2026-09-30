// Contact form → email via Resend's REST API (no SDK needed).
// Env: RESEND_API_KEY (required), CONTACT_TO (required, where messages land),
//      CONTACT_FROM (optional; must be on a domain verified in Resend — the default
//      sandbox sender can only deliver to the Resend account owner's own address),
//      TURNSTILE_SECRET_KEY (optional; when set, every message needs a valid Turnstile token).
// ponytail: no per-IP rate limit (serverless has no shared memory); add a Vercel Firewall rate-limit rule if needed.

const LIMITS = { name: 120, email: 200, topic: 80, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/** Cloudflare's server-side check; tokens are single-use and expire after 5 minutes. */
async function verifyTurnstile(token, secret, ip) {
	if (!token || typeof token !== "string") return false;
	const form = new URLSearchParams({ secret, response: token.slice(0, 2048) });
	if (ip) form.set("remoteip", ip);
	const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
	if (!res.ok) return false;
	const result = await res.json();
	if (!result.success) console.warn("Contact form: Turnstile rejected", result["error-codes"]);
	return result.success === true;
}

/** @returns {Promise<{ status: number, body: Record<string, unknown> }>} */
export async function sendContact(payload, env = process.env, ip = "") {
	const data = payload && typeof payload === "object" ? payload : {};

	// Honeypot: humans never see this field; bots fill everything. Pretend success.
	if (clean(data.website, 200)) return { status: 200, body: { ok: true } };

	const name = clean(data.name, LIMITS.name).replace(/[\r\n]+/g, " ");
	const email = clean(data.email, LIMITS.email);
	const topic = clean(data.topic, LIMITS.topic).replace(/[\r\n]+/g, " ");
	const message = clean(data.message, LIMITS.message);
	const lang = data.lang === "fr" ? "fr" : "en";

	if (!name || !message || !EMAIL_RE.test(email)) {
		return { status: 400, body: { ok: false, error: "invalid" } };
	}

	if (env.TURNSTILE_SECRET_KEY) {
		if (!(await verifyTurnstile(data.token, env.TURNSTILE_SECRET_KEY, ip))) {
			return { status: 403, body: { ok: false, error: "captcha" } };
		}
	} else {
		console.warn("Contact form: TURNSTILE_SECRET_KEY not set, skipping bot check");
	}

	if (!env.RESEND_API_KEY || !env.CONTACT_TO) {
		console.error("Contact form: RESEND_API_KEY / CONTACT_TO not configured");
		return { status: 503, body: { ok: false, error: "not_configured" } };
	}

	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
			to: [env.CONTACT_TO],
			reply_to: email,
			subject: `[Portfolio] ${topic || "Contact"} — ${name}`,
			text: `${message}\n\n—\n${name} <${email}>\nTopic: ${topic || "—"}\nLanguage: ${lang}`,
		}),
	});

	if (!response.ok) {
		console.error("Contact form: Resend error", response.status, await response.text());
		return { status: 502, body: { ok: false, error: "send_failed" } };
	}
	return { status: 200, body: { ok: true } };
}
