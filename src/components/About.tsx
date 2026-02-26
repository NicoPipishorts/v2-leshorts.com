import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { IconType } from 'react-icons'
import { FiBookOpen, FiCheckCircle, FiRefreshCw, FiUsers, FiZap } from 'react-icons/fi'
import AmbientGlows from './AmbientGlows'

interface SoftSkill {
  title: string
  points: string[]
  icon: IconType
}

const About = () => {
  const { t } = useTranslation()

  const softSkills: SoftSkill[] = [
    {
      title: t('about.softSkills.rigor.title'),
      points: [
        t('about.softSkills.rigor.point1'),
        t('about.softSkills.rigor.point2'),
        t('about.softSkills.rigor.point3'),
      ],
      icon: FiCheckCircle,
    },
    {
      title: t('about.softSkills.actionOriented.title'),
      points: [
        t('about.softSkills.actionOriented.point1'),
        t('about.softSkills.actionOriented.point2'),
        t('about.softSkills.actionOriented.point3'),
      ],
      icon: FiZap,
    },
    {
      title: t('about.softSkills.teamwork.title'),
      points: [
        t('about.softSkills.teamwork.point1'),
        t('about.softSkills.teamwork.point2'),
        t('about.softSkills.teamwork.point3'),
      ],
      icon: FiUsers,
    },
    {
      title: t('about.softSkills.adaptability.title'),
      points: [
        t('about.softSkills.adaptability.point1'),
        t('about.softSkills.adaptability.point2'),
        t('about.softSkills.adaptability.point3'),
      ],
      icon: FiRefreshCw,
    },
    {
      title: t('about.softSkills.selfLearner.title'),
      points: [t('about.softSkills.selfLearner.point1')],
      icon: FiBookOpen,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className="page relative isolate min-h-screen px-4 pb-8 pt-24 md:px-8 md:pb-16 md:pt-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AmbientGlows />

      <div className="relative z-10 mx-auto max-w-[1000px]">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-12 text-[clamp(2.5rem,5vw,3.5rem)] font-bold text-[var(--color-text)]">
            {t('about.title')}
          </h1>
        </motion.div>

        <div className="grid gap-12">
          <motion.div
            className="flex flex-col gap-6"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="text-lg leading-[1.8] text-[var(--color-text-light)]">{t('about.paragraph1')}</p>
            <p className="text-lg leading-[1.8] text-[var(--color-text-light)]">{t('about.paragraph2')}</p>
            <p className="text-lg leading-[1.8] text-[var(--color-text-light)]">{t('about.paragraph3')}</p>
            <p className="text-lg leading-[1.8] text-[var(--color-text-light)]">{t('about.paragraph4')}</p>
          </motion.div>

          <motion.div
            className="mt-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="mb-8 text-[2rem] text-[var(--color-text)]">{t('about.softSkillsTitle')}</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {softSkills.map((softSkill) => {
                const Icon = softSkill.icon
                return (
                  <motion.div
                    key={softSkill.title}
                    className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-brand-secondary hover:shadow-[0_4px_16px_rgba(72,139,155,0.15)]"
                    variants={itemVariants}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <Icon className="text-[1.2rem] text-brand-secondary" />
                      <h3 className="text-[1.05rem] font-semibold text-[var(--color-text)]">{softSkill.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {softSkill.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-[0.95rem] text-[var(--color-text-light)]">
                          <span className="mt-[0.45rem] inline-block h-1.5 w-1.5 rounded-full bg-brand-secondary" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default About
