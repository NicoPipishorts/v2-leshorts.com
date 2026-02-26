import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { FiMail } from "react-icons/fi";
import { SiGithub, SiLinkedin } from "react-icons/si";
import AmbientGlows from "./AmbientGlows";
import "../styles/Contact.css";

const Contact = () => {
	const { t } = useTranslation();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
		// Add your form submission logic here
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
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
			name: t("contact.social.email"),
			url: "mailto:hello@example.com",
			icon: FiMail,
		},
	];

	return (
		<motion.div
			className='page contact-page relative isolate'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			<AmbientGlows />

			<div className='contact-container relative z-10'>
				<div className='contact-content'>
					<motion.form
						className='contact-form'
						onSubmit={handleSubmit}
						initial={{ x: -30, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.6 }}>
						<h1 className='page-title'>{t("contact.title")}</h1>

						<div className='form-group'>
							<label htmlFor='name'>{t("contact.form.name")}</label>
							<input
								type='text'
								id='name'
								name='name'
								value={formData.name}
								onChange={handleChange}
								required
								placeholder={t("contact.form.namePlaceholder")}
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='email'>{t("contact.form.email")}</label>
							<input
								type='email'
								id='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								required
								placeholder={t("contact.form.emailPlaceholder")}
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='message'>{t("contact.form.message")}</label>
							<textarea
								id='message'
								name='message'
								value={formData.message}
								onChange={handleChange}
								required
								rows={6}
								placeholder={t("contact.form.messagePlaceholder")}
							/>
						</div>

						<motion.button
							type='submit'
							className='btn btn-primary submit-btn'
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}>
							{t("contact.form.submit")}
						</motion.button>

						<div className='social-icon-row'>
							{socialLinks.map((social, index) => {
								const Icon = social.icon;
								return (
									<motion.a
										key={social.name}
										href={social.url}
										aria-label={social.name}
										title={social.name}
										className='social-icon-link'
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ delay: 0.45 + index * 0.08, duration: 0.35 }}
										whileHover={{ y: -3, scale: 1.06 }}
										whileTap={{ scale: 0.96 }}>
										<Icon aria-hidden='true' />
									</motion.a>
								);
							})}
						</div>
					</motion.form>
				</div>
			</div>
		</motion.div>
	);
};

export default Contact;
