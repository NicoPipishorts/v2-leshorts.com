import { motion } from "framer-motion";
import { useState } from "react";

interface LogoProps {
	className?: string;
	animateOnMount?: boolean;
	hoverEraseBorder?: boolean;
}

const Logo = ({
	className = "",
	animateOnMount = true,
	hoverEraseBorder = false,
}: LogoProps) => {
	const useHoverBorder = hoverEraseBorder && !animateOnMount;
	const [isHovered, setIsHovered] = useState(false);
	const strokeInitial = animateOnMount ? { pathLength: 0, opacity: 0 } : false;
	const strokeAnimate = animateOnMount
		? { pathLength: 1, opacity: 1 }
		: { pathLength: 1, opacity: 1 };
	const fillInitial = animateOnMount ? { opacity: 0 } : false;
	const fillAnimate = animateOnMount ? { opacity: 1 } : { opacity: 1 };
	const strokeTransition = animateOnMount
		? { duration: 2, ease: "easeInOut" }
		: { duration: 0 };
	const fillTransition = animateOnMount
		? { delay: 0.5, duration: 1 }
		: { duration: 0 };

	return (
		<motion.svg
			className={className}
			viewBox='0 0 218 218'
			xmlns='http://www.w3.org/2000/svg'
			onHoverStart={useHoverBorder ? () => setIsHovered(true) : undefined}
			onHoverEnd={useHoverBorder ? () => setIsHovered(false) : undefined}>
			<motion.path
				d="M24.34,70.3c-0.04-4.4,3.03-9.83,6.82-12.06l69.23-40.78c3.79-2.23,10.03-2.29,13.86-0.12l69.94,39.57
          c3.83,2.17,6.99,7.54,7.03,11.94l0.7,80.35c0.04,4.4-3.03,9.83-6.82,12.06l-69.23,40.78c-3.79,2.23-10.03,2.29-13.86,0.12
          l-69.94-39.57c-3.83-2.17-6.99-7.54-7.03-11.94L24.34,70.3z"
				fill='none'
				stroke='currentColor'
				strokeWidth='4'
				strokeMiterlimit='10'
				initial={useHoverBorder ? false : strokeInitial}
				animate={
					useHoverBorder
						? { pathLength: isHovered ? 0 : 1, opacity: 1 }
						: strokeAnimate
				}
				transition={
					useHoverBorder
						? { duration: 0.62, ease: "easeInOut" }
						: strokeTransition
				}
			/>
			<motion.path
				d="M60.5,73.5c6.51-1.73,47.4-31.21,28.5,0.5c-11.22,18.83-21.87,35-21.87,35s-3.38,3.78-0.38,6c2.99,2.21,4.25,4.75,7.75,1
          s22-30.75,36.25-43.5s11.2-3.65,1.94,8.69c-9.43,12.56-15.44,26.06-16.69,33.56s-2.43,16.01,14.75,9
          c29.83-12.18,41.1-8.28,47.23-2.87c4.47,3.95,5.81,15.96-11.84,25.85c-12.22,6.85-23.92,3.14-23.92,3.14l4.07-7.39
          c0,0,10.58-20.04,14.77-28.35c4.59-9.09,0.94-6.47-8.33,7.39c-5.02,7.5-14.17,21.26-14.17,21.26s-31.82,8.62-11.19,18.32
          c0.38,0.18-7.51,10.69-9.58,17.68c-1.59,5.34,3.31,8.32,8.05,4.83c11.11-8.17,3.83-11.53,3.83-11.53l5.55-9.33
          c0,0,36.15,2.51,51.82-18.44c15.79-21.1-3.33-34.96-9.38-37.17c-4.86-1.78-12.98-6.73-42.65,2.6c-5.83,1.83-7.98-0.02-2.98-8.85
          s9.51-12.79,18.77-25.84c12.56-17.72,1.77-31.89-11.76-22.55c-8.1,5.59-41.21,50-41.21,50s20.44-34.81,24.4-41.24
          c3.37-5.48,6.27-18.99-9.4-14.93c-4.5,1.17-8.73,2.18-19.17,8.5c-3.82,2.31-0.38-3.15-0.38-3.15C67.95,54.2,43.58,77.27,60.5,73.5z"
				fill='currentColor'
				initial={fillInitial}
				animate={fillAnimate}
				transition={fillTransition}
			/>
		</motion.svg>
	);
};

export default Logo;
