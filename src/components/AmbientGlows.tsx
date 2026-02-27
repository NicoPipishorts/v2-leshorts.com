import { useMemo } from 'react'

type AmbientGlowVariant = 'home' | 'default'

interface GlowConfig {
  width: string
  height: string
  color: string
  opacity: number
  blurClass: string
  left?: string
  right?: string
  top?: string
  bottom?: string
}

interface AmbientGlowsProps {
  variant?: AmbientGlowVariant
  sticky?: boolean
}

const getGlowConfigs = (variant: AmbientGlowVariant): GlowConfig[] => {
  if (variant === 'home') {
    return [
      {
        width: 'min(52vw,620px)',
        height: 'min(52vw,620px)',
        color: 'rgba(220,92,72,0.34)',
        opacity: 0.56,
        blurClass: 'blur-2xl',
        left: '-10%',
        top: '-10%',
      },
      {
        width: 'min(45vw,520px)',
        height: 'min(45vw,520px)',
        color: 'rgba(72,139,155,0.28)',
        opacity: 0.48,
        blurClass: 'blur-2xl',
        right: '-8%',
        bottom: '-18%',
      },
    ]
  }

  return [
    {
      width: 'min(48vw,560px)',
      height: 'min(48vw,560px)',
      color: 'rgba(220,92,72,0.22)',
      opacity: 0.5,
      blurClass: 'blur-3xl',
      left: '-10%',
      top: '-8%',
    },
    {
      width: 'min(42vw,500px)',
      height: 'min(42vw,500px)',
      color: 'rgba(72,139,155,0.2)',
      opacity: 0.44,
      blurClass: 'blur-3xl',
      right: '-8%',
      bottom: '-16%',
    },
  ]
}

const AmbientGlows = ({ variant = 'default', sticky = false }: AmbientGlowsProps) => {
  const glowConfigs = useMemo(() => getGlowConfigs(variant), [variant])

  return (
    <div
      className={
        sticky
          ? 'pointer-events-none sticky top-0 z-0 -mb-[100vh] h-screen overflow-hidden'
          : 'pointer-events-none absolute inset-0 z-0 overflow-hidden'
      }
      aria-hidden="true"
    >
      {glowConfigs.map((glow, index) => (
        <div
          key={`${variant}-glow-${index}`}
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
  )
}

export default AmbientGlows
