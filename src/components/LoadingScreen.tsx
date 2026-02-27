import { motion } from "framer-motion";
import { useEffect } from "react";
import Logo from "./Logo";
import "../styles/LoadingScreen.css";

interface LoadingScreenProps {
	onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
	useEffect(() => {
		const timer = window.setTimeout(() => {
			onComplete();
		}, 2800);

		return () => window.clearTimeout(timer);
	}, [onComplete]);

	return (
		<motion.div
			className='loading-screen'
			initial={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}>
			<motion.div
				className='loading-logo-container'
				layoutId='app-shared-logo'
				transition={{
					type: "spring",
					stiffness: 145,
					damping: 24,
					mass: 1,
				}}>
				<Logo className='loading-logo' animateOnMount />
			</motion.div>
		</motion.div>
	);
};

export default LoadingScreen;
