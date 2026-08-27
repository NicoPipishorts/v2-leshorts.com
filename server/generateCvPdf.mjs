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

const HARD_SKILLS = {
	frontend: [
		"React",
		"React Native",
		"TS",
		"JS",
		"GraphQL",
		"REST API",
		"TailwindCSS",
		"TanStack Query",
		"Accessibility",
		"Vite",
	],
	backend: ["Node.js", "Strapi", "Prisma", "Sequelize"],
	dataInfra: ["PostgreSQL", "Redis", "Docker"],
	delivery: ["GitHub", "GitLab", "CI/CD", "Code Review"],
	agentic: ["Claude Code", "Codex", "Prompt Engineering"],
};

const EXPERIENCE_ORDER = ["synqit", "kaast", "intercloud", "freelance", "apple", "soudesecoles"];
const COMPACT_PROJECT_ROLE_KEYS = new Set(["freelance"]);
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

const readJsonFile = async (filePath) =>
	JSON.parse(await fs.readFile(filePath, "utf8"));

const drawText = (
	doc,
	text,
	{ x, y, width, font = "Helvetica", size = 10, color = COLORS.text, align = "left", lineGap = 1.5, gapAfter = 4 },
) => {
	if (!text) {
		return y;
	}

	doc.font(font).fontSize(size).fillColor(color);
	doc.text(text, x, y, { width, align, lineGap });
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

export const generateCvPdf = async ({ lang = "en" } = {}) => {
	const currentLanguage = normalizeLanguage(lang);
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

	const headerTitle = locale.about?.heroHeading ?? "Curriculum Vitae";
	const profileSummary = locale.about?.profileSummary ?? "";
	const fullName = [
		privateProfile?.identity?.firstName,
		privateProfile?.identity?.lastName,
	]
		.filter(Boolean)
		.join(" ");
	const leftDetails = [
		privateProfile?.contact?.phone,
		privateProfile?.contact?.email,
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
			estimateTextHeight(doc, line, {
				width: infoWidth,
				size: 10,
				gapAfter: 1,
			}),
		0,
	);
	const detailsStartY = headerTopY + Math.max(0, (headerRowHeight - (nameHeight + detailsHeight)) / 2);
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
		detailsY = drawText(doc, line, {
			x: margin,
			y: detailsY,
			width: infoWidth,
			size: 10,
			color: COLORS.muted,
			gapAfter: 1,
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
	for (const [groupKey, entries] of Object.entries(HARD_SKILLS)) {
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
	const educationEntries = Array.isArray(locale.about?.education?.entries)
		? locale.about.education.entries
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
		gapAfter: 8,
	});

	for (const role of roles) {
		const roleTitleLine = `${role.title}`;
		const roleMeta = [role.company, role.period].filter(Boolean).join(" • ");
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
