import { motion } from "framer-motion";
import { Fragment } from "react";
import meImage from "../../assets/images/me.png";

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
}: AboutHeroProps) => {
	return (
		<motion.section
			className='relative flex items-center overflow-visible px-6 pb-3 pt-22 sm:px-5 md:px-8 md:pb-4 md:pt-10 lg:px-0 lg:pb-0'
			initial={false}>
			<div className='pointer-events-none absolute inset-0 overflow-hidden'></div>
			<div className='pointer-events-none absolute inset-0 z-0 overflow-hidden lg:hidden'>
				<motion.img
					src={meImage}
					alt='Nicolas Pisar'
					className='absolute bottom-0 right-[-42%] h-[48vh] w-auto max-w-none object-contain object-right opacity-20'
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 0.22 }}
					transition={{ duration: 0.72, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
				/>
			</div>

			<div className='relative ml-auto grid w-full max-w-350 items-center gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10'>
				<motion.div
					className='sm:pl-10 relative z-10 w-full max-w-full'
					initial={{ x: -24, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}>
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
				</motion.div>

				<motion.div
					className='relative hidden lg:flex items-end justify-end overflow-visible'
					initial={{ x: -18, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{
						duration: 0.72,
						delay: 0.12,
						ease: [0.22, 1, 0.36, 1],
					}}>
					<div className='pointer-events-none absolute right-[-12%] top-[6%] h-[46vw] w-[46vw] max-h-195 max-w-195 min-h-107.5 min-w-107.5 rounded-full bg-[radial-gradient(circle,rgba(39,59,78,0.52)_0%,rgba(39,59,78,0.34)_40%,rgba(39,59,78,0.08)_62%,rgba(39,59,78,0)_78%)] blur-[70px]' />
					<img
						src={meImage}
						alt='Nicolas Pisar'
						className='relative z-10 h-[68vh] w-auto max-w-[64vw] translate-x-[6vw] object-contain object-right'
					/>
				</motion.div>
			</div>
			<div
				className='pointer-events-none absolute bottom-0 left-0 h-px w-full mix-blend-multiply'
				style={{
					background:
						"linear-gradient(90deg, rgba(57,83,106,0.14) 0%, rgba(40,62,84,0.34) 52%, rgba(48,72,94,0.24) 100%)",
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
