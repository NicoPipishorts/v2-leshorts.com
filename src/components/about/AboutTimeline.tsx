import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import type { ArchitectureDiagramNode, ExperienceRole } from "./types";

interface AboutTimelineProps {
	title: string;
	roles: ExperienceRole[];
	ownershipTitle: string;
}

interface DiagramFlowProps {
	nodes: ArchitectureDiagramNode[];
	idPrefix: string;
	compact?: boolean;
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

const DiagramFlow = ({
	nodes,
	idPrefix,
	compact = false,
}: DiagramFlowProps) => {
	const cardClassName = compact
		? "flex h-full flex-col justify-center rounded-[14px] border border-(--color-border)/60 bg-white/58 px-3 py-2.5 shadow-[0_8px_22px_rgba(16,22,34,0.06)] backdrop-blur-[4px]"
		: "flex h-full flex-col justify-center rounded-[16px] border border-(--color-border)/60 bg-white/62 px-3 py-2.5 shadow-[0_10px_26px_rgba(16,22,34,0.07)] backdrop-blur-[4px]";
	const labelClassName = compact
		? "text-[0.66rem] font-semibold uppercase tracking-[0.11em] text-brand-secondary"
		: "text-[0.67rem] font-semibold uppercase tracking-[0.11em] text-brand-secondary";
	const valueClassName = compact
		? "mt-1 text-[0.8rem] leading-[1.5] text-(--color-text)"
		: "mt-1 text-[0.82rem] leading-[1.5] text-(--color-text)";

	return (
		<motion.div
			className='mt-4'
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true, amount: 0.35 }}
			variants={{
				hidden: {},
				visible: {
					transition: {
						staggerChildren: 0.12,
						delayChildren: 0.06,
					},
				},
			}}>
			<div className='grid gap-2 sm:grid-cols-2 xl:hidden'>
				{nodes.map((node) => (
					<motion.div
						key={`${idPrefix}-${node.label}-mobile`}
						className={cardClassName}
						variants={{
							hidden: { opacity: 0, x: -24, scale: 0.98 },
							visible: {
								opacity: 1,
								x: 0,
								scale: 1,
								transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
							},
						}}>
						<p className={labelClassName}>{node.label}</p>
						<p className={valueClassName}>{node.value}</p>
					</motion.div>
				))}
			</div>

			<div className='hidden xl:flex xl:items-stretch xl:gap-0'>
				{nodes.map((node, index) => (
					<div
						key={`${idPrefix}-${node.label}-desktop`}
						className='flex min-w-0 flex-1 items-center'>
						<motion.div
							className={`w-full ${cardClassName}`}
							variants={{
								hidden: { opacity: 0, x: -28, scale: 0.97 },
								visible: {
									opacity: 1,
									x: 0,
									scale: 1,
									transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
								},
							}}>
							<p className={labelClassName}>{node.label}</p>
							<p className={valueClassName}>{node.value}</p>
						</motion.div>
						{index < nodes.length - 1 && (
							<motion.div
								className='relative mx-2 h-px flex-1 overflow-visible'
								variants={{
									hidden: { opacity: 0, scaleX: 0 },
									visible: {
										opacity: 1,
										scaleX: 1,
										transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
									},
								}}
								style={{ originX: 0 }}>
								<div className='absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-brand-secondary/45' />
								<div className='absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-secondary/55 shadow-[0_0_0_4px_rgba(72,139,155,0.08)]' />
							</motion.div>
						)}
					</div>
				))}
			</div>
		</motion.div>
	);
};

const AboutTimeline = ({
	title,
	roles,
	ownershipTitle,
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
							<p className='mt-1 text-sm font-medium text-brand-primary'>
								{role.company}
							</p>
							<p className='mt-3 text-[0.95rem] leading-[1.74] text-(--color-text-light)'>
								{role.summary}
							</p>
							<ul className='mt-3 space-y-2'>
								{role.bullets.map((point) => (
									<li
										key={point}
										className='flex items-start gap-2 text-[0.9rem] text-(--color-text-light)'>
										<span className='mt-[0.45rem] inline-block h-1.5 w-1.5 rounded-full bg-brand-secondary' />
										<span>{point}</span>
									</li>
								))}
							</ul>
							{role.ownership && role.ownership.length > 0 && (
								<div className='mt-4 border-l border-brand-secondary/20 pl-4 sm:pl-5'>
									<p className='text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-brand-secondary'>
										{ownershipTitle}
									</p>
									<ul className='mt-2 space-y-1.5'>
										{role.ownership.map((item) => (
											<li
												key={`${role.key}-${item}`}
												className='flex items-start gap-2 text-[0.82rem] leading-[1.6] text-(--color-text-light)'>
												<span className='mt-[0.42rem] inline-block h-1.5 w-1.5 rounded-full bg-brand-secondary' />
												<span>{item}</span>
											</li>
										))}
									</ul>
								</div>
							)}
							{role.diagram && role.diagram.length > 0 && (
								<DiagramFlow nodes={role.diagram} idPrefix={role.key} />
							)}
							{role.projectHighlights && role.projectHighlights.length > 0 && (
								<div className='mt-5 space-y-4'>
									{role.projectHighlights.map((project) => (
										<div
											key={`${role.key}-${project.name}`}
											className='border-l-2 border-brand-secondary/35 pl-3 mb-4'>
											<div className='flex flex-wrap items-center gap-2'>
												<h4 className='text-[0.92rem] font-semibold text-brand-secondary pb-0'>
													{project.name}
												</h4>
											</div>
											<p className='text-[0.86rem] leading-[1.68] text-(--color-text-light)'>
												{project.summary}
											</p>
											<ul className='space-y-1.5'>
												{project.bullets.map((point) => (
													<li
														key={`${project.name}-${point}`}
														className='flex items-start gap-2 text-[0.82rem] text-(--color-text-light)'>
														<span className='mt-[0.36rem] inline-block h-1.25 w-1.25 rounded-full bg-brand-secondary' />
														<span>{point}</span>
													</li>
												))}
											</ul>
											{project.ownership && project.ownership.length > 0 && (
												<div className='mt-3 border-l border-brand-secondary/20 pl-3.5 sm:pl-4'>
													<p className='text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-brand-secondary'>
														{ownershipTitle}
													</p>
													<ul className='mt-2 space-y-1.5'>
														{project.ownership.map((item) => (
															<li
																key={`${project.name}-${item}`}
																className='flex items-start gap-2 text-[0.8rem] leading-[1.6] text-(--color-text-light)'>
																<span className='mt-[0.4rem] inline-block h-1.25 w-1.25 rounded-full bg-brand-secondary' />
																<span>{item}</span>
															</li>
														))}
													</ul>
												</div>
											)}
											{project.diagram && project.diagram.length > 0 && (
												<DiagramFlow
													nodes={project.diagram}
													idPrefix={`${role.key}-${project.name}`}
													compact
												/>
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
												<div className='mt-4 flex flex-wrap items-center gap-2'>
													<a
														href={project.link}
														target='_blank'
														rel='noreferrer'
														className='inline-flex items-center rounded-none bg-brand-primary px-3 py-1 text-[0.76rem] font-semibold tracking-[0.01em] text-white transition-colors duration-200 hover:bg-(--color-primary-dark)'>
														<FiExternalLink className='mr-1.5 h-3.5 w-3.5 shrink-0' />
														{getDomainLabel(project.link)}
													</a>
												</div>
											)}
										</div>
									))}
								</div>
							)}
							{role.technologies && role.technologies.length > 0 && (
								<div className='mt-5 flex flex-wrap items-center gap-2'>
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
							{role.links && role.links.length > 0 && (
								<div className='mt-4 flex flex-wrap items-center gap-2'>
									{role.links.map((link) => (
										<a
											key={`${role.key}-${link}`}
											href={link}
											target='_blank'
											rel='noreferrer'
											className='inline-flex items-center rounded-none bg-brand-primary px-3 py-1 text-[0.76rem] font-semibold tracking-[0.01em] text-white transition-colors duration-200 hover:bg-(--color-primary-dark)'>
											<FiExternalLink className='mr-1.5 h-3.5 w-3.5 shrink-0' />
											{getDomainLabel(link)}
										</a>
									))}
								</div>
							)}
						</article>
					))}
				</div>
			</div>
		</motion.section>
	);
};

export default AboutTimeline;
