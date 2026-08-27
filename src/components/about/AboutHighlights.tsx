import { motion } from "framer-motion";

interface AboutHighlightsProps {
	title: string;
	items: string[];
}

const AboutHighlights = ({ title, items }: AboutHighlightsProps) => {
	const [leadItem, ...secondaryItems] = items;

	return (
		<motion.section
			className='mt-14 px-5 md:mt-16 md:px-10 lg:px-14'
			initial={{ y: 18, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ delay: 0.06, duration: 0.4 }}>
			<div className='mx-auto max-w-245'>
				<div className='grid gap-6 border-y border-(--color-border)/75 py-5 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:gap-10 md:py-7'>
					<div className='flex flex-col justify-between gap-4'>
						<p className='text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-brand-secondary'>
							{title}
						</p>
						{leadItem ? (
							<div className='max-w-110'>
								<p className='text-[clamp(1.18rem,2vw,1.7rem)] leading-[1.16] text-(--color-text)'>
									{leadItem}
								</p>
							</div>
						) : null}
					</div>

					<ul className='grid gap-0'>
						{secondaryItems.map((item) => (
							<li
								key={item}
								className='border-t border-(--color-border)/70 py-4 first:border-t-0 first:pt-0'>
								<p className='max-w-135 text-[0.98rem] leading-[1.55] text-(--color-text)'>
									{item}
								</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</motion.section>
	);
};

export default AboutHighlights;
