interface GlowConfig {
	width: string;
	height: string;
	color: string;
	opacity: number;
	blurClass: string;
	left?: string;
	right?: string;
	top?: string;
	bottom?: string;
}

const GLOW_CONFIGS: GlowConfig[] = [
	{
		width: "min(48vw,560px)",
		height: "min(48vw,560px)",
		color: "rgba(220,92,72,0.22)",
		opacity: 0.5,
		blurClass: "blur-3xl",
		left: "-10%",
		top: "-8%",
	},
	{
		width: "min(42vw,500px)",
		height: "min(42vw,500px)",
		color: "rgba(72,139,155,0.2)",
		opacity: 0.44,
		blurClass: "blur-3xl",
		right: "-8%",
		bottom: "-16%",
	},
];

const AmbientGlows = () => {
	return (
		<div
			className='pointer-events-none absolute inset-0 z-0 overflow-hidden'
			aria-hidden='true'>
			{GLOW_CONFIGS.map((glow, index) => (
				<div
					key={`ambient-glow-${index}`}
					className={`absolute rounded-full ${glow.blurClass}`}
					style={{
						width: glow.width,
						height: glow.height,
						background: glow.color,
						opacity: glow.opacity,
						left: glow.left,
						right: glow.right,
						top: glow.top,
						bottom: glow.bottom,
					}}
				/>
			))}
		</div>
	);
};

export default AmbientGlows;
