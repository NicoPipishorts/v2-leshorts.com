import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const LOCALES_DIR = path.join(PROJECT_ROOT, "src", "i18n", "locales");
const PRIVATE_PROFILE_PATH = path.join(
	PROJECT_ROOT,
	"data",
	"private",
	"profile-details.json",
);
const PROFILE_IMAGE_PATH = path.join(PROJECT_ROOT, "src", "assets", "images", "profile-pict.jpg");

export const CV_VARIANTS = ["sfd", "fd", "fs"];
export const DEFAULT_CV_VARIANT = "sfd";

const FRONTEND_CORE = [
	"React",
	"React Native",
	"TS",
	"JS",
	"Redux / Redux Toolkit",
	"TanStack Query",
	"GraphQL",
	"REST API",
	"TailwindCSS",
	"Vite",
	"Accessibility",
];

const DELIVERY_SKILLS = ["GitHub", "GitLab", "CI/CD", "Code Review"];
const AGENTIC_SKILLS = ["Claude Code", "Codex", "Prompt Engineering"];

// Frontend-leaning exports keep the backend column short and spend the room on
// React / UI architecture depth instead.
const FRONTEND_SKILLS = {
	frontend: [...FRONTEND_CORE, "TanStack Router", "SCSS"],
	uiArchitecture: [
		"Design system & component library",
		"State & cache management",
		"Routing & navigation",
		"Responsive UI",
		"Performance",
	],
	backend: ["Node.js", "Strapi"],
	dataInfra: ["PostgreSQL", "Docker"],
	delivery: DELIVERY_SKILLS,
	agentic: AGENTIC_SKILLS,
};

const FULLSTACK_SKILLS = {
	frontend: FRONTEND_CORE,
	backend: ["Node.js", "Express", "Strapi", "Prisma", "Sequelize"],
	dataInfra: ["PostgreSQL", "Redis", "Docker"],
	delivery: DELIVERY_SKILLS,
	agentic: AGENTIC_SKILLS,
};

const SKILL_SETS = {
	sfd: FRONTEND_SKILLS,
	fd: FRONTEND_SKILLS,
	fs: FULLSTACK_SKILLS,
};

const EXPERIENCE_ORDER = ["synqit", "kaast", "intercloud", "freelance", "apple", "soudesecoles"];
const COMPACT_PROJECT_ROLE_KEYS = new Set(["freelance"]);
// Ongoing at the same time — flagged so the PDF does not read as three full-time jobs.
const PARALLEL_ROLE_KEYS = new Set(["synqit", "kaast", "freelance"]);
const COMPACT_PROJECTS_LABEL = {
	en: "Key projects:",
	fr: "Projets clés :",
};

const COLORS = {
	text: "#2c3e50",
	muted: "#5a6c7d",
	accent: "#488B9B",
	primary: "#DC5C48",
	border: "#d4d4d4",
};

export const normalizeLanguage = (value) =>
	typeof value === "string" && value.toLowerCase().startsWith("fr") ? "fr" : "en";

export const normalizeVariant = (value) => {
	const candidate = typeof value === "string" ? value.trim().toLowerCase() : "";
	return CV_VARIANTS.includes(candidate) ? candidate : DEFAULT_CV_VARIANT;
};

const readJsonFile = async (filePath) =>
	JSON.parse(await fs.readFile(filePath, "utf8"));

const drawText = (
	doc,
	text,
	{ x, y, width, font = "Helvetica", size = 10, color = COLORS.text, align = "left", lineGap = 1.5, gapAfter = 4, link = null },
) => {
	if (!text) {
		return y;
	}

	doc.font(font).fontSize(size).fillColor(color);
	doc.text(text, x, y, { width, align, lineGap, link });
	const height = doc.heightOfString(text, { width, align, lineGap });
	return y + height + gapAfter;
};

const drawBullet = (
	doc,
	text,
	{ x, y, width, size = 9, color = COLORS.muted, bulletColor = COLORS.accent, gapAfter = 2 },
) => {
	const bulletOffsetX = x + 1.6;
	const bulletOffsetY = y + 5.6;
	doc.circle(bulletOffsetX, bulletOffsetY, 1.4).fill(bulletColor);
	return drawText(doc, text, {
		x: x + 9,
		y,
		width: width - 9,
		size,
		color,
		gapAfter,
	});
};

// Lays out short labels on one line, each carrying its own PDF link annotation,
// wrapping to a new line when the row runs out of width.
const drawInlineLinks = (
	doc,
	entries,
	{ x, y, width, size = 8.6, color = COLORS.accent, separatorColor = COLORS.border, separator = "  \u00b7  ", gapAfter = 0 },
) => {
	const items = entries.filter((entry) => entry?.label);
	if (items.length === 0) {
		return y;
	}

	doc.font("Helvetica").fontSize(size);
	const separatorWidth = doc.widthOfString(separator);
	const lineHeight = doc.currentLineHeight() + 1.5;
	let cursorX = x;
	let cursorY = y;

	items.forEach((entry, index) => {
		const labelWidth = doc.widthOfString(entry.label);
		if (index > 0) {
			if (cursorX + separatorWidth + labelWidth > x + width) {
				cursorX = x;
				cursorY += lineHeight;
			} else {
				doc.fillColor(separatorColor).text(separator, cursorX, cursorY, {
					width: separatorWidth + 1,
					lineBreak: false,
				});
				cursorX += separatorWidth;
			}
		}
		// pdfkit needs an explicit width to place the link annotation rect.
		doc.fillColor(color).text(entry.label, cursorX, cursorY, {
			width: labelWidth + 1,
			lineBreak: false,
			link: entry.link ?? null,
		});
		cursorX += labelWidth;
	});

	return cursorY + lineHeight + gapAfter;
};

const estimateInlineLinksHeight = (doc, entries, { width, size = 8.6, separator = "  \u00b7  ", gapAfter = 0 }) => {
	const items = entries.filter((entry) => entry?.label);
	if (items.length === 0) {
		return 0;
	}
	doc.font("Helvetica").fontSize(size);
	const separatorWidth = doc.widthOfString(separator);
	const lineHeight = doc.currentLineHeight() + 1.5;
	let used = 0;
	let lines = 1;
	items.forEach((entry, index) => {
		const labelWidth = doc.widthOfString(entry.label);
		const advance = index > 0 ? separatorWidth + labelWidth : labelWidth;
		if (index > 0 && used + advance > width) {
			lines += 1;
			used = labelWidth;
		} else {
			used += advance;
		}
	});
	return lines * lineHeight + gapAfter;
};

const extractRoleBullets = (role) =>
	["point1", "point2", "point3"]
		.map((key) => role[key])
		.filter((value) => typeof value === "string" && value.trim().length > 0);

const extractHobbies = (locale) =>
	Object.entries(locale.about?.hobbies ?? {})
		.sort(([a], [b]) => {
			const aNum = Number.parseInt(a.replace(/\D/g, ""), 10) || 0;
			const bNum = Number.parseInt(b.replace(/\D/g, ""), 10) || 0;
			return aNum - bNum;
		})
		.map(([, value]) => value)
		.filter((value) => typeof value === "string" && value.trim().length > 0);

const makeRoleModels = (locale) =>
	EXPERIENCE_ORDER.map((key) => {
		const role = locale.experience?.roles?.[key];
		if (!role) {
			return null;
		}

		const usesCompactProjects = COMPACT_PROJECT_ROLE_KEYS.has(key);
		const projects = Array.isArray(role.projects)
			? role.projects.map((project) => ({
					name: project.name,
					summary: project.summary,
					bullets: usesCompactProjects
						? []
						: ["point1", "point2", "point3"]
								.map((projectKey) => project[projectKey])
								.filter((value) => typeof value === "string" && value.trim().length > 0),
			  }))
			: [];

		return {
			key,
			title: role.title,
			company: role.company,
			period: role.period,
			summary: role.summary,
			bullets: usesCompactProjects ? extractRoleBullets(role).slice(0, 2) : extractRoleBullets(role),
			projects,
		};
	}).filter(Boolean);

const estimateTextHeight = (
	doc,
	text,
	{ width, font = "Helvetica", size = 10, align = "left", lineGap = 1.5, gapAfter = 4 },
) => {
	if (!text) {
		return 0;
	}
	doc.font(font).fontSize(size);
	return doc.heightOfString(text, { width, align, lineGap }) + gapAfter;
};

const estimateBulletHeight = (doc, text, { width, size = 9, gapAfter = 2 }) =>
	estimateTextHeight(doc, text, {
		width: width - 9,
		size,
		gapAfter,
	});

export const generateCvPdf = async ({ lang = "en", variant = DEFAULT_CV_VARIANT } = {}) => {
	const currentLanguage = normalizeLanguage(lang);
	const currentVariant = normalizeVariant(variant);
	const [locale, privateProfile] = await Promise.all([
		readJsonFile(path.join(LOCALES_DIR, `${currentLanguage}.json`)),
		readJsonFile(PRIVATE_PROFILE_PATH),
	]);

	const profileImageBuffer = await fs.readFile(PROFILE_IMAGE_PATH).catch(() => null);

	const doc = new PDFDocument({ size: "A4", margin: 28, bufferPages: true });
	const chunks = [];
	doc.on("data", (chunk) => chunks.push(chunk));

	const completed = new Promise((resolve, reject) => {
		doc.on("end", () => resolve(Buffer.concat(chunks)));
		doc.on("error", reject);
	});

	const pageWidth = doc.page.width;
	const pageHeight = doc.page.height;
	const margin = 28;
	const contentBottom = pageHeight - margin;

	const variantCopy = locale.about?.cvVariants?.[currentVariant] ?? {};
	const hardSkills = SKILL_SETS[currentVariant] ?? SKILL_SETS[DEFAULT_CV_VARIANT];
	const headerTitle = variantCopy.heading ?? locale.about?.heroHeading ?? "Curriculum Vitae";
	const profileSummary = variantCopy.summary ?? locale.about?.profileSummary ?? "";
	const fullName = [
		privateProfile?.identity?.firstName,
		privateProfile?.identity?.lastName,
	]
		.filter(Boolean)
		.join(" ");
	const contact = privateProfile?.contact ?? {};
	const stripProtocol = (value) => value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
	const toHref = (value) => `https://${stripProtocol(value)}`;
	const leftDetails = [
		contact.phone && { text: contact.phone, link: `tel:${contact.phone.replace(/[^+\d]/g, "")}` },
		contact.email && { text: contact.email, link: `mailto:${contact.email}` },
	].filter(Boolean);
	// Recruiters should be able to click straight through to the proof of work.
	const profileLinks = [
		contact.website && { label: stripProtocol(contact.website), link: toHref(contact.website) },
		contact.linkedin && { label: stripProtocol(contact.linkedin), link: toHref(contact.linkedin) },
		contact.github && { label: stripProtocol(contact.github), link: toHref(contact.github) },
	].filter(Boolean);

	const headerRowHeight = 96;
	const imageSize = 92;
	const imageCircleRadius = imageSize / 2 - 5;
	const infoGap = 18;
	const infoWidth = pageWidth - margin * 2 - imageSize - infoGap;

	const headerTopY = margin;
	const imageX = pageWidth - margin - imageSize;
	const imageY = headerTopY;

	const nameHeight = fullName
		? estimateTextHeight(doc, fullName, {
				width: infoWidth,
				font: "Helvetica-Bold",
				size: 12,
				color: COLORS.text,
				gapAfter: 3,
			})
		: 0;
	const detailsHeight = leftDetails.reduce(
		(total, line) =>
			total +
			estimateTextHeight(doc, line.text, {
				width: infoWidth,
				size: 10,
				gapAfter: 1,
			}),
		0,
	);
	const linksHeight = estimateInlineLinksHeight(doc, profileLinks, {
		width: infoWidth,
		size: 8.6,
		gapAfter: 0,
	});
	const detailsStartY =
		headerTopY +
		Math.max(0, (headerRowHeight - (nameHeight + detailsHeight + (linksHeight ? linksHeight + 3 : 0))) / 2);
	doc.font("Helvetica").fontSize(10).fillColor(COLORS.muted);
	let detailsY = detailsStartY;
	if (fullName) {
		detailsY = drawText(doc, fullName, {
			x: margin,
			y: detailsY,
			width: infoWidth,
			font: "Helvetica-Bold",
			size: 12,
			color: COLORS.text,
			gapAfter: 3,
		});
	}
	for (const line of leftDetails) {
		detailsY = drawText(doc, line.text, {
			x: margin,
			y: detailsY,
			width: infoWidth,
			size: 10,
			color: COLORS.muted,
			gapAfter: 1,
			link: line.link,
		});
	}
	if (profileLinks.length > 0) {
		detailsY = drawInlineLinks(doc, profileLinks, {
			x: margin,
			y: detailsY + 3,
			width: infoWidth,
			size: 8.6,
			color: COLORS.accent,
		});
	}

	if (profileImageBuffer) {
		const centerX = imageX + imageSize / 2;
		const centerY = imageY + imageSize / 2;
		doc.save();
		doc.circle(centerX, centerY, imageCircleRadius).clip();
		doc.image(profileImageBuffer, imageX, imageY, {
			fit: [imageSize, imageSize],
			align: "center",
			valign: "center",
		});
		doc.restore();
		doc.circle(centerX, centerY, imageCircleRadius).lineWidth(2).strokeColor(COLORS.accent).stroke();
	}

	const headerBottomY = headerTopY + headerRowHeight;
	const titleTopY = headerBottomY + 10;
	const titleBottomY = drawText(doc, headerTitle, {
		x: margin,
		y: titleTopY,
		width: pageWidth - margin * 2,
		font: "Helvetica-Bold",
		size: 16,
		color: COLORS.text,
		gapAfter: 0,
	});
	const dividerY = titleBottomY + 8;
	doc.moveTo(margin, dividerY).lineTo(pageWidth - margin, dividerY).lineWidth(1).strokeColor(COLORS.border).stroke();
	let columnsStartY = dividerY + 18;
	if (profileSummary) {
		const summaryBottomY = drawText(doc, profileSummary, {
			x: margin,
			y: columnsStartY,
			width: pageWidth - margin * 2,
			size: 9.4,
			color: COLORS.muted,
			lineGap: 1.6,
			gapAfter: 0,
		});
		columnsStartY = summaryBottomY + 12;
	}

	const highlightsTitle = locale.about?.highlightsTitle ?? "Highlights";
	const highlights = Array.isArray(locale.about?.highlights)
		? locale.about.highlights.filter((item) => typeof item === "string" && item.trim().length > 0)
		: [];
	const contentWidth = pageWidth - margin * 2;
	const columnGap = 28;
	const leftColumnWidth = Math.floor((contentWidth - columnGap) * 0.32);

	const getColumnStartY = (pageIndex) => (pageIndex === 0 ? columnsStartY : margin);

	const switchToOrCreatePage = (pageIndex) => {
		const currentRange = doc.bufferedPageRange();
		if (pageIndex < currentRange.count) {
			doc.switchToPage(currentRange.start + pageIndex);
			return;
		}

		while (doc.bufferedPageRange().count <= pageIndex) {
			doc.addPage();
		}
		const updatedRange = doc.bufferedPageRange();
		doc.switchToPage(updatedRange.start + pageIndex);
	};

	const leftColumn = {
		x: margin,
		width: leftColumnWidth,
		pageIndex: 0,
		y: getColumnStartY(0),
	};
	const rightColumn = {
		x: leftColumn.x + leftColumn.width + columnGap,
		width: contentWidth - leftColumn.width - columnGap,
		pageIndex: 0,
		y: getColumnStartY(0),
	};

	const ensureColumnSpace = (column, requiredHeight = 32) => {
		if (column.y + requiredHeight <= contentBottom) {
			return;
		}
		column.pageIndex += 1;
		switchToOrCreatePage(column.pageIndex);
		column.y = getColumnStartY(column.pageIndex);
	};

	const ensureLeftSpace = (requiredHeight = 32) =>
		ensureColumnSpace(leftColumn, requiredHeight);

	const ensureRightSpace = (requiredHeight = 32) => {
		ensureColumnSpace(rightColumn, requiredHeight);
	};

	switchToOrCreatePage(leftColumn.pageIndex);
	if (highlights.length > 0) {
		ensureLeftSpace(40);
		leftColumn.y = drawText(doc, highlightsTitle, {
			x: leftColumn.x,
			y: leftColumn.y,
			width: leftColumn.width,
			font: "Helvetica-Bold",
			size: 13,
			color: COLORS.text,
			gapAfter: 8,
		});
		for (const item of highlights) {
			ensureLeftSpace(
				estimateBulletHeight(doc, item, {
					width: leftColumn.width,
					size: 8.8,
					gapAfter: 2,
				}) + 1,
			);
			leftColumn.y = drawBullet(doc, item, {
				x: leftColumn.x,
				y: leftColumn.y,
				width: leftColumn.width,
				size: 8.8,
				color: COLORS.muted,
			});
		}
		leftColumn.y += 14;
	}

	const hardSkillsTitle = locale.about?.skillsTitle ?? "Skills & Technologies";
	ensureLeftSpace(40);
	leftColumn.y = drawText(doc, hardSkillsTitle, {
		x: leftColumn.x,
		y: leftColumn.y,
		width: leftColumn.width,
		font: "Helvetica-Bold",
		size: 13,
		color: COLORS.text,
		gapAfter: 8,
	});

	const skillGroupLabels = locale.experience?.skillGroups ?? {};
	for (const [groupKey, entries] of Object.entries(hardSkills)) {
		const title = skillGroupLabels[groupKey] ?? groupKey;
		const content = entries.join(", ");
		const estimated =
			estimateTextHeight(doc, title, {
				width: leftColumn.width,
				font: "Helvetica-Bold",
				size: 9.8,
				color: COLORS.accent,
				gapAfter: 1,
			}) +
			estimateTextHeight(doc, content, {
				width: leftColumn.width,
				size: 8.9,
				color: COLORS.muted,
				gapAfter: 5,
			});
		ensureLeftSpace(estimated + 6);
		leftColumn.y = drawText(doc, title, {
			x: leftColumn.x,
			y: leftColumn.y,
			width: leftColumn.width,
			font: "Helvetica-Bold",
			size: 9.8,
			color: COLORS.accent,
			gapAfter: 1,
		});
		leftColumn.y = drawText(doc, content, {
			x: leftColumn.x,
			y: leftColumn.y,
			width: leftColumn.width,
			size: 8.9,
			color: COLORS.muted,
			gapAfter: 5,
		});
	}

	const strengthsTitle =
		locale.about?.softSkillsTitle ?? locale.about?.strengthsTitle ?? "Soft Skills";
	const strengths = Array.isArray(locale.about?.strengths)
		? locale.about.strengths.filter((item) => typeof item === "string" && item.trim().length > 0)
		: [];

	ensureLeftSpace(40);
	leftColumn.y += 14;
	leftColumn.y = drawText(doc, strengthsTitle, {
		x: leftColumn.x,
		y: leftColumn.y,
		width: leftColumn.width,
		font: "Helvetica-Bold",
		size: 13,
		color: COLORS.text,
		gapAfter: 8,
	});

	for (const item of strengths) {
		ensureLeftSpace(
			estimateBulletHeight(doc, item, {
				width: leftColumn.width,
				size: 8.8,
				gapAfter: 2,
			}) + 1,
		);
		leftColumn.y = drawBullet(doc, item, {
			x: leftColumn.x,
			y: leftColumn.y,
			width: leftColumn.width,
			size: 8.8,
			color: COLORS.muted,
		});
	}

	const educationTitle = locale.about?.education?.title ?? "Education";
	// Entries flagged pdfExclude (the high-school diploma) stay on the site but are
	// dropped here — at 10+ years of experience the space is worth more elsewhere.
	const educationEntries = Array.isArray(locale.about?.education?.entries)
		? locale.about.education.entries.filter((entry) => !entry?.pdfExclude)
		: [];

	if (educationEntries.length > 0) {
		ensureLeftSpace(36);
		leftColumn.y += 12;
		leftColumn.y = drawText(doc, educationTitle, {
			x: leftColumn.x,
			y: leftColumn.y,
			width: leftColumn.width,
			font: "Helvetica-Bold",
			size: 13,
			color: COLORS.text,
			gapAfter: 8,
		});

		for (const entry of educationEntries) {
			const meta = [entry.institution, entry.period].filter(Boolean).join(" • ");
			const entryHeight =
				estimateTextHeight(doc, entry.title, {
					width: leftColumn.width,
					font: "Helvetica-Bold",
					size: 9.4,
					gapAfter: 1,
				}) +
				estimateTextHeight(doc, meta, {
					width: leftColumn.width,
					font: "Helvetica-Bold",
					size: 8.1,
					color: COLORS.primary,
					gapAfter: 2,
				}) +
				(entry.bullets ?? []).reduce(
					(total, bullet) =>
						total +
						estimateBulletHeight(doc, bullet, {
							width: leftColumn.width,
							size: 8.4,
							gapAfter: 1,
						}),
					0,
				) +
				4;
			ensureLeftSpace(entryHeight);
			leftColumn.y = drawText(doc, entry.title, {
				x: leftColumn.x,
				y: leftColumn.y,
				width: leftColumn.width,
				font: "Helvetica-Bold",
				size: 9.4,
				color: COLORS.text,
				gapAfter: 1,
			});
			leftColumn.y = drawText(doc, meta, {
				x: leftColumn.x,
				y: leftColumn.y,
				width: leftColumn.width,
				font: "Helvetica-Bold",
				size: 8.1,
				color: COLORS.primary,
				gapAfter: 2,
			});
			for (const bullet of entry.bullets ?? []) {
				leftColumn.y = drawBullet(doc, bullet, {
					x: leftColumn.x,
					y: leftColumn.y,
					width: leftColumn.width,
					size: 8.4,
					color: COLORS.muted,
					gapAfter: 1,
				});
			}
			leftColumn.y += 4;
		}
	}

	const experienceTitle = locale.experience?.rolesTitle ?? "Professional Experience";
	const parallelNote = locale.experience?.parallelNote ?? "";
	const parallelTag = locale.experience?.parallelTag ?? "";
	const roles = makeRoleModels(locale);

	rightColumn.pageIndex = 0;
	rightColumn.y = getColumnStartY(0);
	switchToOrCreatePage(rightColumn.pageIndex);
	ensureRightSpace(36);
	rightColumn.y = drawText(doc, experienceTitle, {
		x: rightColumn.x,
		y: rightColumn.y,
		width: rightColumn.width,
		font: "Helvetica-Bold",
		size: 13,
		color: COLORS.text,
		gapAfter: parallelNote ? 3 : 8,
	});
	if (parallelNote) {
		rightColumn.y = drawText(doc, parallelNote, {
			x: rightColumn.x,
			y: rightColumn.y,
			width: rightColumn.width,
			font: "Helvetica-Oblique",
			size: 8.2,
			color: COLORS.accent,
			gapAfter: 8,
		});
	}

	for (const role of roles) {
		const roleTitleLine = `${role.title}`;
		const roleMeta = [
			role.company,
			role.period,
			PARALLEL_ROLE_KEYS.has(role.key) && parallelTag ? parallelTag : null,
		]
			.filter(Boolean)
			.join(" • ");
		ensureRightSpace(26);

		doc.font("Helvetica-Bold").fontSize(10.6);
		const roleTitleWidth = doc.widthOfString(roleTitleLine);
		doc.font("Helvetica-Bold").fontSize(8.4);
		const roleMetaWidth = doc.widthOfString(roleMeta);
		const metaFitsInline =
			roleTitleWidth + roleMetaWidth + 12 <= rightColumn.width;

		if (metaFitsInline) {
			const titleBottomY = drawText(doc, roleTitleLine, {
				x: rightColumn.x,
				y: rightColumn.y,
				width: rightColumn.width,
				font: "Helvetica-Bold",
				size: 10.6,
				color: COLORS.text,
				gapAfter: 0,
			});
			drawText(doc, roleMeta, {
				x: rightColumn.x,
				y: rightColumn.y + 2,
				width: rightColumn.width,
				font: "Helvetica-Bold",
				size: 8.4,
				color: COLORS.primary,
				align: "right",
				gapAfter: 0,
			});
			rightColumn.y = titleBottomY + 4;
		} else {
			rightColumn.y = drawText(doc, roleTitleLine, {
				x: rightColumn.x,
				y: rightColumn.y,
				width: rightColumn.width,
				font: "Helvetica-Bold",
				size: 10.6,
				color: COLORS.text,
				gapAfter: 1,
			});
			rightColumn.y = drawText(doc, roleMeta, {
				x: rightColumn.x,
				y: rightColumn.y,
				width: rightColumn.width,
				font: "Helvetica-Bold",
				size: 8.4,
				color: COLORS.primary,
				gapAfter: 3,
			});
		}
		ensureRightSpace(
			estimateTextHeight(doc, role.summary, {
				width: rightColumn.width,
				size: 9,
				color: COLORS.muted,
				gapAfter: 3,
			}) + 2,
		);
		rightColumn.y = drawText(doc, role.summary, {
			x: rightColumn.x,
			y: rightColumn.y,
			width: rightColumn.width,
			size: 9,
			color: COLORS.muted,
			gapAfter: 3,
		});

		for (const bullet of role.bullets ?? []) {
			ensureRightSpace(
				estimateTextHeight(doc, bullet, {
					width: rightColumn.width - 9,
					size: 8.8,
					color: COLORS.muted,
					gapAfter: 2,
				}) + 1,
			);
			rightColumn.y = drawBullet(doc, bullet, {
				x: rightColumn.x,
				y: rightColumn.y,
				width: rightColumn.width,
				size: 8.8,
				color: COLORS.muted,
			});
		}
		if (COMPACT_PROJECT_ROLE_KEYS.has(role.key) && (role.projects ?? []).length > 0) {
			const projectNames = role.projects
				.map((project) => project.name)
				.filter((name) => typeof name === "string" && name.trim().length > 0)
				.join(", ");
			const projectLine = `${COMPACT_PROJECTS_LABEL[currentLanguage]} ${projectNames}`;
			ensureRightSpace(
				estimateTextHeight(doc, projectLine, {
					width: rightColumn.width,
					size: 8.8,
					color: COLORS.muted,
					gapAfter: 2,
				}) + 1,
			);
			rightColumn.y = drawText(doc, projectLine, {
				x: rightColumn.x,
				y: rightColumn.y,
				width: rightColumn.width,
				size: 8.8,
				color: COLORS.muted,
				gapAfter: 2,
			});
		}

		for (const project of COMPACT_PROJECT_ROLE_KEYS.has(role.key) ? [] : role.projects ?? []) {
			rightColumn.y += 1;
			ensureRightSpace(22);
			rightColumn.y = drawText(doc, project.name, {
				x: rightColumn.x,
				y: rightColumn.y,
				width: rightColumn.width,
				font: "Helvetica-Bold",
				size: 9.2,
				color: COLORS.accent,
				gapAfter: 1,
			});
			ensureRightSpace(
				estimateTextHeight(doc, project.summary, {
					width: rightColumn.width,
					size: 8.8,
					color: COLORS.muted,
					gapAfter: 2,
				}) + 1,
			);
			rightColumn.y = drawText(doc, project.summary, {
				x: rightColumn.x,
				y: rightColumn.y,
				width: rightColumn.width,
				size: 8.8,
				color: COLORS.muted,
				gapAfter: 2,
			});
			for (const bullet of project.bullets ?? []) {
				ensureRightSpace(
					estimateTextHeight(doc, bullet, {
						width: rightColumn.width - 9,
						size: 8.7,
						color: COLORS.muted,
						gapAfter: 1,
					}) + 1,
				);
				rightColumn.y = drawBullet(doc, bullet, {
					x: rightColumn.x,
					y: rightColumn.y,
					width: rightColumn.width,
					size: 8.7,
					color: COLORS.muted,
				});
			}
		}

		rightColumn.y += 3;
		ensureRightSpace(8);
		doc
			.moveTo(rightColumn.x, rightColumn.y)
			.lineTo(rightColumn.x + rightColumn.width, rightColumn.y)
			.lineWidth(0.6)
			.strokeColor(COLORS.border)
			.stroke();
		rightColumn.y += 6;
	}

	const hobbiesTitle = locale.about?.hobbiesTitle ?? "Hobbies";
	const hobbies = extractHobbies(locale);
	if (hobbies.length > 0) {
		switchToOrCreatePage(leftColumn.pageIndex);
		ensureLeftSpace(36);
		leftColumn.y += 12;
		leftColumn.y = drawText(doc, hobbiesTitle, {
			x: leftColumn.x,
			y: leftColumn.y,
			width: leftColumn.width,
			font: "Helvetica-Bold",
			size: 13,
			color: COLORS.text,
			gapAfter: 8,
		});

		for (const hobby of hobbies) {
			ensureLeftSpace(
				estimateBulletHeight(doc, hobby, {
					width: leftColumn.width,
					size: 8.6,
					gapAfter: 2,
				}) + 1,
			);
			leftColumn.y = drawBullet(doc, hobby, {
				x: leftColumn.x,
				y: leftColumn.y,
				width: leftColumn.width,
				size: 8.6,
				color: COLORS.muted,
			});
		}
	}

	doc.end();
	return completed;
};
