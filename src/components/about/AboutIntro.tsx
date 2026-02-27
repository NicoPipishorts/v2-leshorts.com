import { motion } from "framer-motion";

interface AboutIntroProps {
	paragraphs: string[];
}

const AboutIntro = ({ paragraphs }: AboutIntroProps) => {
	return (
		<motion.section
			className='mt-16 px-5 md:mt-20 md:px-10 lg:px-14'
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ delay: 0.08, duration: 0.4 }}>
			<div className='mx-auto max-w-245 space-y-5'>
				{paragraphs.map((paragraph) => (
					<p key={paragraph} className='mb-2 text-base leading-[1.86] text-(--color-text-light)'>
						{paragraph}
					</p>
				))}
			</div>
		</motion.section>
	);
};

export default AboutIntro;
