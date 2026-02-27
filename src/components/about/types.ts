import type { IconType } from "react-icons";

export interface ExperienceProjectHighlight {
	name: string;
	summary: string;
	bullets: string[];
	link?: string;
}

export interface ExperienceRole {
	key: string;
	title: string;
	company: string;
	period: string;
	summary: string;
	bullets: string[];
	links?: string[];
	projectHighlightsTitle?: string;
	projectHighlights?: ExperienceProjectHighlight[];
}

export interface SkillItem {
	name: string;
	icon: IconType;
}

export interface SkillGroup {
	key: string;
	title: string;
	icon: IconType;
	skills: SkillItem[];
}

export interface SoftSkillGroup {
	title: string;
	bullets: string[];
}

export interface EducationEntry {
	title: string;
	institution: string;
	period: string;
	bullets?: string[];
}
