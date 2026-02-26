import { motion } from 'framer-motion'
import { useMemo } from 'react'

type AmbientGlowVariant = 'home' | 'default'

interface GlowConfig {
  width: string
  height: string
  color: string
  opacityFrames: number[]
  blurClass: string
  left?: string
  right?: string
  top?: string
  bottom?: string
  range: number
}

interface AmbientGlowsProps {
  variant?: AmbientGlowVariant
  sticky?: boolean
}

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min

const createDriftFrames = (base: number, range: number) => [
  base,
  base + randomBetween(-range, range),
  base + randomBetween(-range * 0.65, range * 0.65),
  base + randomBetween(-range * 0.9, range * 0.9),
  base,
]

const createScaleFrames = () => [
  1,
  randomBetween(1.04, 1.14),
  randomBetween(0.9, 1.02),
  randomBetween(1.02, 1.1),
  1,
]

const getGlowConfigs = (variant: AmbientGlowVariant): GlowConfig[] => {
  if (variant === 'home') {
    return [
      {
        width: 'min(52vw,620px)',
        height: 'min(52vw,620px)',
        color: 'rgba(220,92,72,0.34)',
        opacityFrames: [0.56, 0.72, 0.61, 0.68, 0.56],
        blurClass: 'blur-2xl',
        left: '-10%',
        top: '-10%',
        range: 120,
      },
      {
        width: 'min(45vw,520px)',
        height: 'min(45vw,520px)',
        color: 'rgba(72,139,155,0.28)',
        opacityFrames: [0.48, 0.67, 0.57, 0.64, 0.48],
        blurClass: 'blur-2xl',
        right: '-8%',
        bottom: '-18%',
        range: 95,
      },
    ]
  }

  return [
    {
      width: 'min(48vw,560px)',
      height: 'min(48vw,560px)',
      color: 'rgba(220,92,72,0.22)',
      opacityFrames: [0.5, 0.67, 0.58, 0.64, 0.5],
      blurClass: 'blur-3xl',
      left: '-10%',
      top: '-8%',
      range: 110,
    },
    {
      width: 'min(42vw,500px)',
      height: 'min(42vw,500px)',
      color: 'rgba(72,139,155,0.2)',
      opacityFrames: [0.44, 0.62, 0.53, 0.6, 0.44],
      blurClass: 'blur-3xl',
      right: '-8%',
      bottom: '-16%',
      range: 90,
    },
  ]
}

const AmbientGlows = ({ variant = 'default', sticky = false }: AmbientGlowsProps) => {
  const glowConfigs = useMemo(() => getGlowConfigs(variant), [variant])

  const glows = useMemo(
    () =>
      glowConfigs.map((config) => {
        const baseX = randomBetween(-24, 24)
        const baseY = randomBetween(-24, 24)
        return {
          ...config,
          xFrames: createDriftFrames(baseX, config.range),
          yFrames: createDriftFrames(baseY, config.range),
          scaleFrames: createScaleFrames(),
          duration: randomBetween(17, 27),
          delay: randomBetween(0, 2.4),
        }
      }),
    [glowConfigs],
  )

  return (
    <div
      className={
        sticky
          ? 'pointer-events-none sticky top-0 z-0 -mb-[100vh] h-screen overflow-hidden'
          : 'pointer-events-none absolute inset-0 z-0 overflow-hidden'
      }
      aria-hidden="true"
    >
      {glows.map((glow, index) => (
        <motion.div
          key={`${variant}-glow-${index}`}
          className={`absolute rounded-full ${glow.blurClass}`}
          style={{
            width: glow.width,
            height: glow.height,
            background: glow.color,
            left: glow.left,
            right: glow.right,
            top: glow.top,
            bottom: glow.bottom,
          }}
          animate={{
            x: glow.xFrames,
            y: glow.yFrames,
            scale: glow.scaleFrames,
            opacity: glow.opacityFrames,
          }}
          transition={{
            duration: glow.duration,
            delay: glow.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default AmbientGlows
