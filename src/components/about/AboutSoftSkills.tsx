import { motion } from "framer-motion";
import { SoftSkillGroup } from "./types";

interface AboutSoftSkillsProps {
	title: string;
	intro: string;
	skillGroups: SoftSkillGroup[];
}

const AboutSoftSkills = ({ title, intro, skillGroups }: AboutSoftSkillsProps) => {
	return (
		<motion.section
			className='mt-28 px-5 md:mt-36 md:px-10 lg:px-14'
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ delay: 0.18, duration: 0.4 }}>
			<div className='mx-auto max-w-245'>
				<h2 className='text-[2rem] text-(--color-text)'>{title}</h2>
				<p className='mt-2 max-w-190 text-[0.98rem] leading-[1.75] text-(--color-text-light)'>
					{intro}
				</p>
				<div className='relative mt-8 border-l border-[rgba(72,139,155,0.28)] pl-6 md:pl-10'>
					{skillGroups.map((group, index) => (
						<article
							key={group.title}
							className={`relative mb-8 pb-6 last:mb-0 last:pb-0 ${
								index === skillGroups.length - 1
									? ""
									: "border-b border-(--color-border)/70"
							}`}>
							<span className='absolute -left-4.25 sm:-left-8.25 top-1 h-3.5 w-3.5 -translate-x-full rounded-full border-2 border-brand-secondary bg-(--color-background)' />
							<h3 className='text-[1rem] font-semibold text-(--color-text) md:text-[1.06rem]'>
								{group.title}
							</h3>
							<ul className='mt-2 space-y-2'>
								{group.bullets.map((point) => (
									<li
										key={`${group.title}-${point}`}
										className='flex items-start gap-2 text-[0.9rem] text-(--color-text-light)'>
										<span className='mt-[0.45rem] inline-block h-1.5 w-1.5 rounded-full bg-brand-secondary' />
										<span>{point}</span>
									</li>
								))}
							</ul>
						</article>
					))}
				</div>
			</div>
		</motion.section>
	);
};

export default AboutSoftSkills;
