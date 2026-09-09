import {
	generateCvPdf,
	normalizeLanguage,
	normalizeVariant,
} from "../server/generateCvPdf.mjs";

const firstValue = (value) => (Array.isArray(value) ? value[0] : value);

export default async function handler(req, res) {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET");
		res.status(405).json({ error: "Method Not Allowed" });
		return;
	}

	try {
		const lang = normalizeLanguage(firstValue(req.query?.lang));
		const variant = normalizeVariant(firstValue(req.query?.variant));
		const pdfBuffer = await generateCvPdf({ lang, variant });

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="nicolas-pisar-cv-${variant}-${lang}.pdf"`,
		);
		res.setHeader("Cache-Control", "private, max-age=0, no-cache, no-store, must-revalidate");
		res.status(200).send(pdfBuffer);
	} catch (error) {
		console.error("CV PDF generation failed:", error);
		res.status(500).json({ error: "Failed to generate CV PDF" });
	}
}
