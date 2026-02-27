import { motion } from "framer-motion";
import { Fragment } from "react";
import meImage from "../../assets/images/me.png";

interface AboutHeroStats {
	codingValue: string;
	codingLabel: string;
	productsValue: string;
	productsLabel: string;
	impactValue: string;
	impactLabel: string;
}

interface AboutHeroProps {
	title: string;
	heading: string;
	row1Prefix: string;
	row1Items: string[];
	row2Prefix: string;
	row2Items: string[];
	row3Prefix: string;
	row3Items: string[];
	row3Join: string;
	paragraph: string;
	stats: AboutHeroStats;
}

const AboutHero = ({
	title,
	heading,
	row1Prefix,
	row1Items,
	row2Prefix,
	row2Items,
	row3Prefix,
	row3Items,
	row3Join,
	paragraph,
	stats,
}: AboutHeroProps) => {
	return (
		<motion.section
			className='relative flex items-center overflow-visible px-4 pb-3 pt-8 sm:px-5 md:px-8 md:pb-4 lg:px-0 lg:pb-0'
			initial={{ y: 24, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5 }}>
			<div className='pointer-events-none absolute inset-0 overflow-hidden'></div>
			<div className='pointer-events-none absolute inset-0 z-0 overflow-hidden lg:hidden'>
				<img
					src={meImage}
					alt='Nicolas Pisar'
					className='absolute bottom-0 right-[-42%] h-[48vh] w-auto max-w-none object-contain object-right opacity-60'
				/>
			</div>

			<div className='relative ml-auto grid w-full max-w-350 items-center gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10'>
				<div className='relative z-10 w-full max-w-full'>
					<p className='mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary'>
						{title}
					</p>
					<h1 className='text-[clamp(1.15rem,3.25vw,2.55rem)] font-bold leading-[1.02] text-(--color-text) md:whitespace-nowrap'>
						{heading}
					</h1>
					<div className='mt-6 space-y-4 text-[1.03rem] leading-[1.75] text-(--color-text-light)'>
						<p className='mb-2 flex flex-wrap items-center gap-2'>
							<span className='font-semibold text-(--color-text)'>
								{row1Prefix}
							</span>
							{row1Items.map((item, index) => (
								<Fragment key={item}>
									{index > 0 && (
										<span className='text-(--color-text-light)'>,</span>
									)}
									<span className='inline-flex bg-white/62 px-2.5 py-0.5 font-medium text-(--color-text)'>
										{item}
									</span>
								</Fragment>
							))}
						</p>
						<p className='mb-2 flex flex-wrap items-center gap-2'>
							<span className='font-semibold text-(--color-text)'>
								{row2Prefix}
							</span>
							{row2Items.map((item, index) => (
								<Fragment key={item}>
									{index > 0 && (
										<span className='text-(--color-text-light)'>,</span>
									)}
									<span className='inline-flex bg-white/62 px-2.5 py-0.5 font-medium text-(--color-text)'>
										{item}
									</span>
								</Fragment>
							))}
						</p>
						<p className='mb-2 flex flex-wrap items-center gap-2'>
							<span className='font-semibold text-(--color-text)'>
								{row3Prefix}
							</span>
							{row3Items.map((item, index) => (
								<Fragment key={item}>
									{index > 0 && (
										<span className='text-(--color-text-light)'>
											{index === row3Items.length - 1 ? row3Join : ","}
										</span>
									)}
									<span className='inline-flex bg-white/62 px-2.5 py-0.5 font-medium text-(--color-text)'>
										{item}
									</span>
								</Fragment>
							))}
						</p>
					</div>
					<p className='mt-6 max-w-190 text-base leading-[1.8] text-(--color-text-light)'>
						{paragraph}
					</p>

					<div className='mt-8 grid grid-cols-3 gap-2 sm:gap-3'>
						<div className='min-w-0 bg-white/52 px-2 py-2 text-center backdrop-blur-[1px] sm:px-3 sm:py-2.5'>
							<p className='text-base font-semibold leading-none text-(--color-text) sm:text-xl'>
								{stats.codingValue}
							</p>
							<p className='mt-1 text-[0.56rem] uppercase leading-tight tracking-[0.04em] text-(--color-text-light) sm:text-xs sm:tracking-[0.07em]'>
								{stats.codingLabel}
							</p>
						</div>
						<div className='min-w-0 bg-white/52 px-2 py-2 text-center backdrop-blur-[1px] sm:px-3 sm:py-2.5'>
							<p className='text-base font-semibold leading-none text-(--color-text) sm:text-xl'>
								{stats.productsValue}
							</p>
							<p className='mt-1 text-[0.56rem] uppercase leading-tight tracking-[0.04em] text-(--color-text-light) sm:text-xs sm:tracking-[0.07em]'>
								{stats.productsLabel}
							</p>
						</div>
						<div className='min-w-0 bg-white/52 px-2 py-2 text-center backdrop-blur-[1px] sm:px-3 sm:py-2.5'>
							<p className='text-base font-semibold leading-none text-(--color-text) sm:text-xl'>
								{stats.impactValue}
							</p>
							<p className='mt-1 text-[0.56rem] uppercase leading-tight tracking-[0.04em] text-(--color-text-light) sm:text-xs sm:tracking-[0.07em]'>
								{stats.impactLabel}
							</p>
						</div>
					</div>
				</div>

				<div className='relative hidden lg:flex items-end justify-end overflow-visible'>
					<div className='pointer-events-none absolute right-[-12%] top-[6%] h-[46vw] w-[46vw] max-h-[780px] max-w-[780px] min-h-[430px] min-w-[430px] rounded-full bg-[radial-gradient(circle,rgba(39,59,78,0.52)_0%,rgba(39,59,78,0.34)_40%,rgba(39,59,78,0.08)_62%,rgba(39,59,78,0)_78%)] blur-[70px]' />
					<img
						src={meImage}
						alt='Nicolas Pisar'
						className='relative z-10 h-[68vh] w-auto max-w-[64vw] translate-x-[6vw] object-contain object-right'
					/>
				</div>
			</div>
			<div
				className='pointer-events-none absolute bottom-0 left-0 h-px w-full'
				style={{
					background:
						"linear-gradient(90deg, rgba(231,237,242,0.06) 0%, rgba(39,59,78,0.5) 52%, rgba(52,75,97,0.34) 100%)",
				}}
			/>
			<div
				className='pointer-events-none absolute -bottom-5 left-1/2 h-12 w-1/2 blur-[14px]'
				style={{
					background:
						"linear-gradient(90deg, rgba(18,29,42,0) 0%, rgba(18,29,42,0.2) 44%, rgba(18,29,42,0.34) 100%)",
				}}
			/>
		</motion.section>
	);
};

export default AboutHero;
