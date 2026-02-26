import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { IconType } from 'react-icons'
import { FiEye } from 'react-icons/fi'
import {
  SiD3Dotjs,
  SiExpress,
  SiFirebase,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiRedux,
  SiTypescript,
} from 'react-icons/si'
import '../styles/Portfolio.css'
import image1 from '../assets/images/home_page_1.jpg'
import image2 from '../assets/images/home_page_2.jpg'
import image3 from '../assets/images/home_page_3.jpg'
import image4 from '../assets/images/home_page_4.jpg'

const Portfolio = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1)

  const projects = [
    {
      id: 1,
      slug: 'ecommerce-platform',
      title: t('portfolio.projects.ecommerce.title'),
      description: t('portfolio.projects.ecommerce.description'),
      tags: ['React', 'Node.js', 'PostgreSQL'],
      image: image1,
      color: '#DC5C48'
    },
    {
      id: 2,
      slug: 'task-manager',
      title: t('portfolio.projects.taskManager.title'),
      description: t('portfolio.projects.taskManager.description'),
      tags: ['Next.js', 'TypeScript', 'MongoDB'],
      image: image2,
      color: '#488B9B'
    },
    {
      id: 3,
      slug: 'analytics-dashboard',
      title: t('portfolio.projects.analytics.title'),
      description: t('portfolio.projects.analytics.description'),
      tags: ['React', 'D3.js', 'Express'],
      image: image3,
      color: '#9B6B48'
    },
    {
      id: 4,
      slug: 'social-media-app',
      title: t('portfolio.projects.socialMedia.title'),
      description: t('portfolio.projects.socialMedia.description'),
      tags: ['React Native', 'Firebase', 'Redux'],
      image: image4,
      color: '#5C8ADC'
    }
  ]

  const techIcons: Record<string, IconType> = {
    React: SiReact,
    'Node.js': SiNodedotjs,
    PostgreSQL: SiPostgresql,
    'Next.js': SiNextdotjs,
    TypeScript: SiTypescript,
    MongoDB: SiMongodb,
    'D3.js': SiD3Dotjs,
    Express: SiExpress,
    'React Native': SiReact,
    Firebase: SiFirebase,
    Redux: SiRedux,
  }

  const handleNext = () => {
    if (currentIndex < projects.length - 1) {
      setSlideDirection(1)
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSlideDirection(-1)
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleIndicatorClick = (index: number) => {
    if (index === currentIndex) {
      return
    }

    setSlideDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const handleCardClick = (slug: string) => {
    navigate({ to: `/portfolio/${slug}` })
  }

  const activeProject = projects[currentIndex]

  return (
    <motion.div
      className="page portfolio-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="portfolio-container">
        <div className="stacked-cards-container">
          <div className="cards-stack">
            <AnimatePresence initial={false} mode="sync" custom={slideDirection}>
              <motion.div
                key={`image-${activeProject.id}`}
                custom={slideDirection}
                variants={{
                  enter: (direction: number) => ({
                    x: direction > 0 ? '100%' : '-100%',
                    scale: 1.02,
                  }),
                  center: {
                    x: 0,
                    scale: 1,
                    transition: {
                      x: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                      scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    },
                  },
                  exit: (direction: number) => ({
                    x: direction > 0 ? '-34%' : '34%',
                    scale: 0.98,
                    transition: {
                      x: { duration: 0.56, delay: 0.1, ease: [0.65, 0, 0.35, 1] },
                      scale: { duration: 0.56, delay: 0.1, ease: [0.65, 0, 0.35, 1] },
                    },
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                onClick={() => handleCardClick(activeProject.slug)}
                className="stacked-card"
              >
                <div className="card-image-container">
                  <img src={activeProject.image} alt={activeProject.title} />
                  <div
                    className="card-overlay"
                    style={{
                      background: `linear-gradient(180deg, rgba(9, 14, 24, 0.15) 0%, rgba(9, 14, 24, 0.7) 100%), linear-gradient(120deg, ${activeProject.color}60 0%, transparent 60%)`,
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence initial={false} mode="sync" custom={slideDirection}>
              <motion.div
                key={`info-${activeProject.id}`}
                custom={slideDirection}
                variants={{
                  enter: (direction: number) => ({
                    x: direction > 0 ? '28%' : '-28%',
                    opacity: 0,
                  }),
                  center: {
                    x: 0,
                    opacity: 1,
                    transition: {
                      x: { duration: 0.5, delay: 0.22, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: 0.35, delay: 0.22 },
                    },
                  },
                  exit: (direction: number) => ({
                    x: direction > 0 ? '-28%' : '28%',
                    opacity: 0,
                    transition: {
                      x: { duration: 0.24, ease: [0.65, 0, 0.35, 1] },
                      opacity: { duration: 0.2 },
                    },
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                className="card-info"
              >
                <h3>{activeProject.title}</h3>
                <p>{activeProject.description}</p>
                <div className="project-tags">
                  {activeProject.tags.map((tag) => {
                    const StackIcon = techIcons[tag]

                    return (
                      <span key={tag} className="tag">
                        {StackIcon && <StackIcon aria-hidden="true" />}
                        <span className="tag-label">{tag}</span>
                      </span>
                    )
                  })}
                </div>

                <motion.button
                  className="project-cta"
                  onClick={() => handleCardClick(activeProject.slug)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="View project"
                >
                  <FiEye aria-hidden="true" />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="card-controls">
            <motion.button
              className="control-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ←
            </motion.button>

            <div className="card-indicators">
              {projects.map((_, index) => (
                <motion.div
                  key={index}
                  className={`indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => handleIndicatorClick(index)}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            <motion.button
              className="control-btn"
              onClick={handleNext}
              disabled={currentIndex === projects.length - 1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              →
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Portfolio
