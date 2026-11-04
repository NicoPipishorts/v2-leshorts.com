// Contact form → POST /api/contact (api/contact.js; locally the Vite dev server's twin in vite.config.ts).
// The server checks the honeypot, the Turnstile token (when TURNSTILE_SECRET_KEY is set) and sends the emails via Resend.
(() => {
	const form = document.getElementById("contact-form");
	if (!form) return;
	const done = document.getElementById("sent-ok");
	const btn = form.querySelector("button[type=submit]");
	const status = form.querySelector("[data-status]");
	const MAIL = "me@nicolaspisar.com";
	const say = (msg, kind = "") => { status.textContent = msg; status.dataset.kind = kind; status.hidden = !msg; };

	// Turnstile: invisible for most visitors, a checkbox only when Cloudflare is unsure.
	// Unbuilt pages (dev) still carry the placeholder → Cloudflare's always-pass test key.
	const key = form.dataset.sitekey.startsWith("__") ? "1x00000000000000000000AA" : form.dataset.sitekey;
	let token = "", widget = null;
	window.npTurnstileReady = () => {
		widget = window.turnstile.render("#turnstile", {
			sitekey: key, language: "fr", theme: "light", appearance: "interaction-only",
			callback: (t) => (token = t), "expired-callback": () => (token = ""), "error-callback": () => (token = ""),
		});
	};
	const s = Object.assign(document.createElement("script"), { src: "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=npTurnstileReady", async: true });
	document.head.append(s);
	// The token usually arrives within a second; give it a little time if the visitor is quick.
	const waitToken = async () => { for (let i = 0; !token && widget !== null && i < 30; i++) await new Promise((r) => setTimeout(r, 100)); return token; };

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		if (!form.checkValidity()) { form.reportValidity(); return; }
		const f = new FormData(form);
		const org = String(f.get("organization") || "").trim();
		const body = {
			name: f.get("name"),
			email: f.get("email"),
			topic: form.querySelector("input[name=t]:checked + span")?.textContent || "",
			message: (org ? `Entreprise / association : ${org}\n\n` : "") + f.get("message"),
			website: f.get("website"),
			lang: "fr",
			token: await waitToken(),
		};
		btn.disabled = true;
		say("Envoi en cours…");
		try {
			const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
			if (res.ok) {
				form.hidden = true;
				done.hidden = false;
				done.focus();
				return;
			}
			say(res.status === 403
				? `La vérification anti-robot n'a pas abouti. Réessayez dans un instant, ou écrivez-moi à ${MAIL}.`
				: res.status === 400
					? "Il manque quelque chose : vérifiez votre nom, votre e-mail et votre message."
					: `Le message n'est pas parti. Réessayez, ou écrivez-moi directement à ${MAIL}.`, "error");
		} catch {
			say(`Pas de connexion au serveur. Réessayez, ou écrivez-moi directement à ${MAIL}.`, "error");
		} finally {
			btn.disabled = false;
			token = ""; // tokens are single-use
			if (widget !== null) window.turnstile?.reset(widget);
		}
	});
})();
