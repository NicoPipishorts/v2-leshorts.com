import { motion } from "framer-motion";
import { EducationEntry } from "./types";

interface AboutEducationProps {
	title: string;
	intro: string;
	entries: EducationEntry[];
}

const AboutEducation = ({ title, intro, entries }: AboutEducationProps) => {
	return (
		<motion.section
			className='mt-28 px-5 md:mt-36 md:px-10 lg:px-14'
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ delay: 0.2, duration: 0.4 }}>
			<div className='mx-auto max-w-245'>
				<h2 className='text-[2rem] text-(--color-text)'>{title}</h2>
				<p className='mt-2 max-w-190 text-[0.98rem] leading-[1.75] text-(--color-text-light)'>
					{intro}
				</p>
				<div className='relative mt-8 border-l border-[rgba(72,139,155,0.28)] pl-6 md:pl-10'>
					{entries.map((entry, index) => (
						<article
							key={`${entry.title}-${entry.period}`}
							className={`relative mb-8 pb-6 last:mb-0 last:pb-0 ${
								index === entries.length - 1
									? ""
									: "border-b border-(--color-border)/70"
							}`}>
							<span className='absolute -left-4.25 sm:-left-8.25 top-2 h-4 w-4 -translate-x-full rounded-full border-2 border-brand-secondary bg-(--color-background)' />
							<div className='flex flex-wrap items-baseline justify-between gap-2'>
								<h3 className='text-[1.05rem] font-semibold text-(--color-text) md:text-[1.12rem]'>
									{entry.title}
								</h3>
								<span className='text-xs font-semibold uppercase tracking-[0.08em] text-brand-secondary'>
									{entry.period}
								</span>
							</div>
							<p className='mt-1 text-sm font-medium text-brand-primary'>
								{entry.institution}
							</p>
							{entry.bullets && entry.bullets.length > 0 && (
								<ul className='mt-3 space-y-2'>
									{entry.bullets.map((point) => (
										<li
											key={`${entry.title}-${point}`}
											className='flex items-start gap-2 text-[0.9rem] text-(--color-text-light)'>
											<span className='mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary' />
											<span>{point}</span>
										</li>
									))}
								</ul>
							)}
						</article>
					))}
				</div>
			</div>
		</motion.section>
	);
};

export default AboutEducation;
