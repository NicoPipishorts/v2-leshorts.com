import { motion } from "framer-motion";
import { ExperienceRole } from "./types";

interface AboutTimelineProps {
	title: string;
	roles: ExperienceRole[];
}

const AboutTimeline = ({ title, roles }: AboutTimelineProps) => {
	return (
		<motion.section
			className='mt-28 px-5 md:mt-36 md:px-10 lg:px-14'
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ delay: 0.12, duration: 0.4 }}>
			<div className='mx-auto max-w-245'>
				<h2 className='text-[2rem] text-(--color-text)'>{title}</h2>
				<div className='relative mt-8 border-l border-[rgba(72,139,155,0.28)] pl-6 md:pl-10'>
					{roles.map((role, index) => (
						<article
							key={role.key}
							className={`relative mb-10 pb-8 last:mb-0 last:pb-0 ${index === roles.length - 1 ? "" : "border-b border-(--color-border)/70"}`}>
							<span className='absolute -left-4.25 sm:-left-8.25 top-2 h-4 w-4 -translate-x-full rounded-full border-2 border-brand-secondary bg-(--color-background)' />
							<div className='flex flex-wrap items-baseline justify-between gap-2'>
								<h3 className='text-[1.05rem] font-semibold text-(--color-text) md:text-[1.12rem]'>
									{role.title}
								</h3>
								<span className='text-xs font-semibold uppercase tracking-[0.08em] text-brand-secondary'>
									{role.period}
								</span>
							</div>
							<p className='mt-1 text-sm font-medium text-brand-primary'>{role.company}</p>
							<p className='mt-3 text-[0.95rem] leading-[1.74] text-(--color-text-light)'>
								{role.summary}
							</p>
							<ul className='mt-3 space-y-2'>
								{role.bullets.map((point) => (
									<li key={point} className='flex items-start gap-2 text-[0.9rem] text-(--color-text-light)'>
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

export default AboutTimeline;
