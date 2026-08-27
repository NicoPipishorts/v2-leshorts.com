import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import type { ExperienceRole } from "./types";

interface AboutTimelineProps {
	title: string;
	roles: ExperienceRole[];
	ownershipTitle: string;
	projectsTitle: string;
}

const getDomainLabel = (link: string) => {
	try {
		return new URL(link).hostname.replace(/^www\./i, "");
	} catch {
		return link
			.replace(/^https?:\/\//i, "")
			.replace(/^www\./i, "")
			.split("/")[0];
	}
};

const AboutTimeline = ({
	title,
	roles,
	ownershipTitle,
	projectsTitle,
}: AboutTimelineProps) => {
	return (
		<motion.section
			className='mt-28 px-5 md:mt-36 md:px-10 lg:px-14'
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ delay: 0.12, duration: 0.4 }}>
			<div className='mx-auto max-w-245'>
				<h2 className='text-[2rem] text-(--color-text)'>{title}</h2>
				<div className='relative mt-8 border-l border-[rgba(72,139,155,0.28)] pl-6 md:pl-10'>
					{roles.map((role, index) => {
						return (
							<article
								key={role.key}
								className={`relative mb-14 pb-10 last:mb-0 last:pb-0 ${index === roles.length - 1 ? "" : "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-linear-to-r after:from-(--color-border)/80 after:to-transparent"}`}>
								<span className='absolute -left-4.25 top-2 h-4 w-4 -translate-x-full rounded-full border-2 border-brand-secondary bg-(--color-background) sm:-left-8.25' />
								<div className='flex flex-wrap items-baseline justify-between gap-2'>
									<h3 className='text-[1.05rem] font-semibold text-(--color-text) md:text-[1.12rem]'>
										{role.title}
									</h3>
									<span className='text-xs font-semibold uppercase tracking-[0.08em] text-brand-secondary'>
										{role.period}
									</span>
								</div>
								{role.links && role.links.length > 0 ? (
									<div className='mt-2.5 flex flex-wrap items-center gap-2'>
										{role.links.map((link) => (
											<a
												key={`${role.key}-${link}`}
												href={link}
												target='_blank'
												rel='noreferrer'
												className='cta-external inline-flex items-center rounded-none bg-brand-primary px-3 py-1 text-[0.76rem] font-semibold tracking-[0.01em] text-white transition-colors duration-200 hover:bg-(--color-primary-dark)'>
												<FiExternalLink className='mr-1.5 h-3.5 w-3.5 shrink-0' />
												{getDomainLabel(link)}
											</a>
										))}
									</div>
								) : (
									<p className='mt-1 text-sm font-medium text-brand-primary'>
										{role.company}
									</p>
								)}
								<p className='mt-4 max-w-[72ch] text-[0.93rem] leading-[1.7] text-(--color-text-light)'>
									{role.summary}
								</p>
								<ul className='mt-5 space-y-3'>
									{role.bullets.map((point) => (
										<li
											key={point}
											className='flex items-start gap-2.5 text-[0.9rem] leading-[1.7] text-(--color-text-light)'>
											<span className='mt-[0.48rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary' />
											<span>{point}</span>
										</li>
									))}
								</ul>
								{((role.ownership && role.ownership.length > 0) ||
									(role.diagram && role.diagram.length > 0)) && (
									<div className='mt-9'>
										<p className='text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-brand-secondary'>
											{ownershipTitle}
										</p>
										{role.ownership && role.ownership.length > 0 && (
											<p className='mt-3 text-[0.9rem] leading-[1.65] text-(--color-text)'>
												{role.ownership.join(" · ")}
											</p>
										)}
										{role.diagram && role.diagram.length > 0 && (
											<dl className='mt-5 divide-y divide-(--color-border)/60 border-t border-(--color-border)/70'>
												{role.diagram.map((node) => (
													<div
														key={`${role.key}-${node.label}`}
														className='grid gap-1 py-4 sm:grid-cols-[10.5rem_minmax(0,1fr)] sm:gap-6'>
														<dt className='text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-brand-secondary'>
															{node.label}
														</dt>
														<dd className='max-w-[70ch] text-[0.9rem] leading-[1.65] text-(--color-text-light)'>
															{node.value}
														</dd>
													</div>
												))}
											</dl>
										)}
									</div>
								)}
								{role.technologies && role.technologies.length > 0 && (
									<div className='mt-7 flex flex-wrap items-center gap-2'>
										{role.technologies.map((technology) => {
											const TechnologyIcon = technology.icon;
											return (
												<span
													key={`${role.key}-${technology.name}`}
													className='inline-flex items-center gap-2 rounded-md bg-white/56 px-3 py-1.5 text-[0.82rem] text-(--color-text)'>
													<TechnologyIcon className='text-[0.9rem] text-brand-secondary' />
													<span>{technology.name}</span>
												</span>
											);
										})}
									</div>
								)}
								{role.projectHighlights && role.projectHighlights.length > 0 && (
									<div className='mt-9'>
										<p className='text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-brand-secondary'>
											{projectsTitle}
										</p>
										<div className='mt-3'>
											{role.projectHighlights.map((project, projectIndex) => (
												<div
													key={`${role.key}-${project.name}`}
													className='relative grid gap-3 py-6 transition-transform duration-300 ease-out before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:from-(--color-border)/80 before:to-transparent last:pb-0 hover:translate-x-1.5 md:grid-cols-[42px_minmax(0,1fr)] md:gap-5'>
													<span className='text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-(--color-text-light) md:pt-1'>
														{String(projectIndex + 1).padStart(2, "0")}
													</span>
													<div>
														<h4 className='text-[1rem] font-semibold text-(--color-text)'>
															{project.name}
														</h4>
														<p className='mt-2 max-w-[70ch] text-[0.9rem] leading-[1.7] text-(--color-text-light)'>
															{project.summary}
														</p>
														{project.ownership && project.ownership.length > 0 && (
															<p className='mt-3 text-[0.84rem] leading-[1.6] text-brand-secondary'>
																{project.ownership.join(" · ")}
															</p>
														)}
														{project.technologies &&
															project.technologies.length > 0 && (
																<div className='mt-5 flex flex-wrap items-center gap-2'>
																	{project.technologies.map((technology) => {
																		const TechnologyIcon = technology.icon;
																		return (
																			<span
																				key={`${project.name}-${technology.name}`}
																				className='inline-flex items-center gap-2 rounded-md bg-white/56 px-3 py-1.5 text-[0.82rem] text-(--color-text)'>
																				<TechnologyIcon className='text-[0.9rem] text-brand-secondary' />
																				<span>{technology.name}</span>
																			</span>
																		);
																	})}
																</div>
															)}
														{project.link && (
															<div className='mt-5 flex flex-wrap items-center gap-2'>
																<a
																	href={project.link}
																	target='_blank'
																	rel='noreferrer'
																	className='cta-external inline-flex items-center rounded-none bg-brand-primary px-3 py-1 text-[0.76rem] font-semibold tracking-[0.01em] text-white transition-colors duration-200 hover:bg-(--color-primary-dark)'>
																	<FiExternalLink className='mr-1.5 h-3.5 w-3.5 shrink-0' />
																	{getDomainLabel(project.link)}
																</a>
															</div>
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</article>
						);
					})}
				</div>
			</div>
		</motion.section>
	);
};

export default AboutTimeline;
