import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { IconType } from 'react-icons'
import { FiBriefcase, FiFolder, FiLayers, FiServer } from 'react-icons/fi'
import {
  SiDocker,
  SiGit,
  SiJavascript,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiReactquery,
  SiRedis,
  SiSequelize,
  SiStrapi,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from 'react-icons/si'
import AmbientGlows from './AmbientGlows'

interface ExperienceRole {
  key: string
  title: string
  company: string
  period: string
  summary: string
  bullets: string[]
}

interface SkillItem {
  name: string
  icon: IconType
}

interface SkillGroup {
  key: string
  title: string
  icon: IconType
  skills: SkillItem[]
}

const Experience = () => {
  const { t } = useTranslation()

  const roles: ExperienceRole[] = [
    {
      key: 'vuedesprit',
      title: t('experience.roles.vuedesprit.title'),
      company: t('experience.roles.vuedesprit.company'),
      period: t('experience.roles.vuedesprit.period'),
      summary: t('experience.roles.vuedesprit.summary'),
      bullets: [
        t('experience.roles.vuedesprit.point1'),
        t('experience.roles.vuedesprit.point2'),
        t('experience.roles.vuedesprit.point3'),
      ],
    },
    {
      key: 'kaast',
      title: t('experience.roles.kaast.title'),
      company: t('experience.roles.kaast.company'),
      period: t('experience.roles.kaast.period'),
      summary: t('experience.roles.kaast.summary'),
      bullets: [
        t('experience.roles.kaast.point1'),
        t('experience.roles.kaast.point2'),
        t('experience.roles.kaast.point3'),
      ],
    },
    {
      key: 'intercloud',
      title: t('experience.roles.intercloud.title'),
      company: t('experience.roles.intercloud.company'),
      period: t('experience.roles.intercloud.period'),
      summary: t('experience.roles.intercloud.summary'),
      bullets: [
        t('experience.roles.intercloud.point1'),
        t('experience.roles.intercloud.point2'),
        t('experience.roles.intercloud.point3'),
      ],
    },
    {
      key: 'apple',
      title: t('experience.roles.apple.title'),
      company: t('experience.roles.apple.company'),
      period: t('experience.roles.apple.period'),
      summary: t('experience.roles.apple.summary'),
      bullets: [
        t('experience.roles.apple.point1'),
        t('experience.roles.apple.point2'),
        t('experience.roles.apple.point3'),
      ],
    },
    {
      key: 'soudesecoles',
      title: t('experience.roles.soudesecoles.title'),
      company: t('experience.roles.soudesecoles.company'),
      period: t('experience.roles.soudesecoles.period'),
      summary: t('experience.roles.soudesecoles.summary'),
      bullets: [
        t('experience.roles.soudesecoles.point1'),
        t('experience.roles.soudesecoles.point2'),
        t('experience.roles.soudesecoles.point3'),
      ],
    },
  ]

  const skillGroups: SkillGroup[] = [
    {
      key: 'frontend',
      title: t('experience.skillGroups.frontend'),
      icon: FiLayers,
      skills: [
        { name: 'React', icon: SiReact },
        { name: 'React Native', icon: SiReact },
        { name: 'TypeScript', icon: SiTypescript },
        { name: 'JavaScript', icon: SiJavascript },
        { name: 'TailwindCSS', icon: SiTailwindcss },
        { name: 'TanStack Query', icon: SiReactquery },
        { name: 'Vite', icon: SiVite },
      ],
    },
    {
      key: 'backend',
      title: t('experience.skillGroups.backend'),
      icon: FiServer,
      skills: [
        { name: 'Node.js', icon: SiNodedotjs },
        { name: 'Strapi', icon: SiStrapi },
        { name: 'Prisma', icon: SiPrisma },
        { name: 'Sequelize', icon: SiSequelize },
      ],
    },
    {
      key: 'dataInfra',
      title: t('experience.skillGroups.dataInfra'),
      icon: FiBriefcase,
      skills: [
        { name: 'PostgreSQL', icon: SiPostgresql },
        { name: 'Redis', icon: SiRedis },
        { name: 'Docker', icon: SiDocker },
      ],
    },
    {
      key: 'delivery',
      title: t('experience.skillGroups.delivery'),
      icon: FiFolder,
      skills: [
        { name: 'Git', icon: SiGit },
        { name: 'API Design', icon: FiServer },
        { name: 'Product Discovery', icon: FiLayers },
        { name: 'Technical Leadership', icon: FiBriefcase },
      ],
    },
  ]

  return (
    <motion.div
      className="page relative isolate min-h-screen px-4 pb-12 pt-24 md:px-8 md:pb-16 md:pt-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <AmbientGlows />

      <div className="relative z-10 mx-auto max-w-[1150px]">
        <motion.header
          className="mb-8 md:mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[clamp(2.25rem,4.4vw,3.2rem)] font-bold text-[var(--color-text)]">
            {t('experience.title')}
          </h1>
          <p className="mt-3 max-w-[760px] text-base leading-[1.75] text-[var(--color-text-light)] md:text-lg">
            {t('experience.subtitle')}
          </p>
        </motion.header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]">
          <motion.section
            className="rounded-2xl border border-[var(--color-border)] bg-white/95 p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)] backdrop-blur-[2px] md:p-7"
            initial={{ x: -22, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.45 }}
          >
            <h2 className="mb-5 text-[1.6rem] text-[var(--color-text)]">{t('experience.rolesTitle')}</h2>
            <div className="space-y-6">
              {roles.map((role, index) => (
                <article
                  key={role.key}
                  className="rounded-xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.78)] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)] md:p-5"
                >
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-[1.05rem] font-semibold text-[var(--color-text)] md:text-[1.15rem]">
                      {role.title}
                    </h3>
                    <span className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-brand-secondary">
                      {role.period}
                    </span>
                  </div>
                  <p className="mb-2 text-sm font-medium text-brand-primary">{role.company}</p>
                  <p className="text-[0.95rem] leading-[1.65] text-[var(--color-text-light)]">{role.summary}</p>
                  <ul className="mt-3 space-y-2">
                    {role.bullets.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-[0.91rem] text-[var(--color-text-light)]">
                        <span className="mt-[0.45rem] inline-block h-1.5 w-1.5 rounded-full bg-brand-secondary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  {index !== roles.length - 1 && <div className="mt-4 h-px bg-[var(--color-border)]/75" />}
                </article>
              ))}
            </div>
          </motion.section>

          <motion.aside
            className="rounded-2xl border border-[var(--color-border)] bg-white/95 p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)] backdrop-blur-[2px] md:p-7"
            initial={{ x: 22, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.45 }}
          >
            <h2 className="mb-5 text-[1.6rem] text-[var(--color-text)]">{t('experience.hardSkillsTitle')}</h2>
            <div className="space-y-6">
              {skillGroups.map((group) => {
                const GroupIcon = group.icon
                return (
                  <section
                    key={group.key}
                    className="rounded-xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.82)] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <GroupIcon className="text-[1rem] text-brand-primary" />
                      <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-[var(--color-text)]">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => {
                        const SkillIcon = skill.icon
                        return (
                          <li
                            key={skill.name}
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-[0.8rem] font-medium text-[var(--color-text)]"
                          >
                            <SkillIcon className="text-[0.9rem] text-brand-secondary" />
                            <span>{skill.name}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                )
              })}
            </div>
          </motion.aside>
        </div>
      </div>
    </motion.div>
  )
}

export default Experience
