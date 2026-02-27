import type { IconType } from "react-icons";

export interface ExperienceRole {
	key: string;
	title: string;
	company: string;
	period: string;
	summary: string;
	bullets: string[];
	links?: string[];
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
