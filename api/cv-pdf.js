import { generateCvPdf, normalizeLanguage } from "../server/generateCvPdf.mjs";

export default async function handler(req, res) {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET");
		res.status(405).json({ error: "Method Not Allowed" });
		return;
	}

	try {
		const rawLang = Array.isArray(req.query?.lang) ? req.query.lang[0] : req.query?.lang;
		const lang = normalizeLanguage(rawLang);
		const pdfBuffer = await generateCvPdf({ lang });

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="nicolas-pisar-cv-${lang}.pdf"`,
		);
		res.setHeader("Cache-Control", "private, max-age=0, no-cache, no-store, must-revalidate");
		res.status(200).send(pdfBuffer);
	} catch (error) {
		console.error("CV PDF generation failed:", error);
		res.status(500).json({ error: "Failed to generate CV PDF" });
	}
}
