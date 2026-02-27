import { motion } from "framer-motion";

interface AboutHobbiesProps {
	title: string;
	intro: string;
	hobbies: string[];
}

const AboutHobbies = ({ title, intro, hobbies }: AboutHobbiesProps) => {
	return (
		<motion.section
			className='mt-28 px-5 pb-16 md:mt-36 md:px-10 md:pb-20 lg:px-14'
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ delay: 0.2, duration: 0.4 }}>
			<div className='mx-auto max-w-270'>
				<h2 className='text-[2rem] text-(--color-text)'>{title}</h2>
				<p className='mt-2 max-w-190 text-[0.98rem] leading-[1.75] text-(--color-text-light)'>
					{intro}
				</p>
				<ul className='mt-5 flex list-none flex-wrap gap-2.5'>
					{hobbies.map((hobby) => (
						<li
							key={hobby}
							className='rounded-md bg-white/56 px-3.5 py-1.5 text-[0.84rem] font-medium text-(--color-text) shadow-[0_4px_12px_rgba(16,22,34,0.1)]'>
							{hobby}
						</li>
					))}
				</ul>
			</div>
		</motion.section>
	);
};

export default AboutHobbies;
