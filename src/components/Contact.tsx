import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { FiSend } from "react-icons/fi";
import { SiGithub, SiInstagram, SiLinkedin } from "react-icons/si";
import AmbientGlows from "./AmbientGlows";

interface ContactProps {
	embedded?: boolean;
}

const Contact = ({ embedded = false }: ContactProps) => {
	const { t } = useTranslation();

	const decodeProtectedEmail = () => {
		// XOR-obfuscated to avoid exposing plain text email in source.
		const encoded = [
			84, 92, 121, 87, 80, 90, 86, 85, 88, 74, 73, 80, 74, 88, 75, 23, 90, 86,
			84,
		];
		return encoded.map((code) => String.fromCharCode(code ^ 57)).join("");
	};

	const handleEmailClick = () => {
		window.location.href = `mailto:${decodeProtectedEmail()}`;
	};

	const socialLinks: Array<{ name: string; url: string; icon: IconType }> = [
		{
			name: t("contact.social.github"),
			url: "https://github.com/NicoPipishorts",
			icon: SiGithub,
		},
		{
			name: t("contact.social.linkedin"),
			url: "https://www.linkedin.com/in/nicolaspisar/",
			icon: SiLinkedin,
		},
		{
			name: "Instagram",
			url: "https://www.instagram.com/bricoshorts/",
			icon: SiInstagram,
		},
	];

	return (
		<motion.div
			className={`relative isolate ${
				embedded
					? "mt-28 px-5 pb-16 md:mt-36 md:px-10 md:pb-20 lg:px-14"
					: "page min-h-screen px-4 pb-12 pt-28 md:px-8 md:pb-16 md:pt-32"
			}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			{!embedded && <AmbientGlows />}

			<div className='relative z-10 mx-auto w-full max-w-270'>
				<div className='mx-auto w-full max-w-190'>
					<motion.div
						className='flex flex-col items-center'
						initial={{ x: -30, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.6 }}>
						<div className='mt-1 flex w-full items-center justify-center gap-3 md:gap-4'>
							{socialLinks.map((social, index) => {
								const Icon = social.icon;
								return (
									<motion.a
										key={social.name}
										href={social.url}
										target='_blank'
										rel='noreferrer noopener'
										aria-label={social.name}
										title={social.name}
										className='group inline-flex h-14 w-14 items-center justify-center rounded-full bg-transparent text-[1.75rem] text-(--color-text) transition-all duration-300 hover:text-brand-primary md:h-16 md:w-16 md:text-[2rem]'
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ delay: 0.45 + index * 0.08, duration: 0.35 }}
										whileHover={{
											y: [0, -11, 0, -7, 0, -4, 0],
											scale: [1, 1.08, 1, 1.05, 1, 1.02, 1],
											transition: {
												duration: 0.88,
												times: [0, 0.16, 0.31, 0.5, 0.66, 0.81, 1],
												ease: "easeOut",
											},
										}}
										whileTap={{ scale: 0.96 }}>
										<Icon
											aria-hidden='true'
											className='drop-shadow-[0_6px_14px_rgba(16,22,34,0.24)] transition-[filter] duration-300 group-hover:drop-shadow-[0_7px_16px_rgba(220,92,72,0.26)]'
										/>
									</motion.a>
								);
							})}
							<motion.button
								type='button'
								onClick={handleEmailClick}
								aria-label={t("contact.social.email")}
								title={t("contact.social.email")}
								className='group inline-flex h-14 w-14 appearance-none items-center justify-center rounded-full border-none bg-transparent p-0 text-[1.75rem] text-(--color-text) transition-all duration-300 hover:text-brand-primary md:h-16 md:w-16 md:text-[2rem]'
								whileHover={{
									y: [0, -11, 0, -7, 0, -4, 0],
									scale: [1, 1.08, 1, 1.05, 1, 1.02, 1],
									transition: {
										duration: 0.88,
										times: [0, 0.16, 0.31, 0.5, 0.66, 0.81, 1],
										ease: "easeOut",
									},
								}}
								whileTap={{ scale: 0.96 }}>
								<FiSend
									aria-hidden='true'
									className='drop-shadow-[0_6px_14px_rgba(16,22,34,0.24)] transition-[filter] duration-300 group-hover:drop-shadow-[0_7px_16px_rgba(220,92,72,0.26)]'
								/>
							</motion.button>
						</div>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
};

export default Contact;
