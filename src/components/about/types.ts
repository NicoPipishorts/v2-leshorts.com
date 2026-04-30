import type { IconType } from "react-icons";

export interface ExperienceProjectHighlight {
	name: string;
	summary: string;
	bullets: string[];
	ownership?: string[];
	diagram?: ArchitectureDiagramNode[];
	link?: string;
	technologies?: SkillItem[];
}

export interface ExperienceRole {
	key: string;
	title: string;
	company: string;
	period: string;
	summary: string;
	bullets: string[];
	ownership?: string[];
	diagram?: ArchitectureDiagramNode[];
	links?: string[];
	technologies?: SkillItem[];
	projectHighlights?: ExperienceProjectHighlight[];
}

export interface ArchitectureDiagramNode {
	label: string;
	value: string;
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
