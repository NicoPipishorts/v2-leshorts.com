import { sendContact } from "../server/sendContact.mjs";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		res.status(405).json({ ok: false, error: "method_not_allowed" });
		return;
	}

	try {
		const { status, body } = await sendContact(req.body);
		res.status(status).json(body);
	} catch (error) {
		console.error("Contact form failed:", error);
		res.status(500).json({ ok: false, error: "server_error" });
	}
}
