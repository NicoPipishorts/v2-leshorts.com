import { motion } from "framer-motion";
import { useEffect } from "react";
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
			transition={{ duration: 0.5, ease: "easeOut" }}
		/>
	);
};

export default LoadingScreen;
