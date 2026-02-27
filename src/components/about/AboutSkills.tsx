import { motion } from "framer-motion";
import { SkillGroup } from "./types";

interface AboutSkillsProps {
	title: string;
	intro: string;
	skillGroups: SkillGroup[];
}

const AboutSkills = ({ title, intro, skillGroups }: AboutSkillsProps) => {
	return (
		<motion.section
			className='mt-28 px-5 md:mt-36 md:px-10 lg:px-14'
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ delay: 0.16, duration: 0.4 }}>
			<div className='mx-auto max-w-270'>
				<h2 className='text-[2rem] text-(--color-text)'>{title}</h2>
				<p className='mt-2 text-[0.98rem] text-(--color-text-light)'>{intro}</p>

				<div className='mt-8 divide-y divide-(--color-border)/75'>
					{skillGroups.map((group) => {
						const GroupIcon = group.icon;
						return (
							<div key={group.key} className='grid gap-4 py-5 md:grid-cols-[220px_1fr] md:items-start'>
								<div className='inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-(--color-text)'>
									<GroupIcon className='text-[0.95rem] text-brand-primary' />
									<span>{group.title}</span>
								</div>
								<ul className='flex flex-wrap gap-2.5'>
									{group.skills.map((skill) => {
										const SkillIcon = skill.icon;
										return (
											<li
												key={skill.name}
												className='inline-flex items-center gap-2 rounded-md bg-white/56 px-3 py-1.5 text-[0.82rem] text-(--color-text) shadow-[0_4px_12px_rgba(16,22,34,0.1)]'>
												<SkillIcon className='text-[0.9rem] text-brand-secondary' />
												<span>{skill.name}</span>
											</li>
										);
									})}
								</ul>
							</div>
						);
					})}
				</div>
			</div>
		</motion.section>
	);
};

export default AboutSkills;
