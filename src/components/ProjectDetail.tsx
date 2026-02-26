import { motion } from 'framer-motion'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import '../styles/ProjectDetail.css'

const ProjectDetail = () => {
  const { slug } = useParams({ from: '/portfolio/$slug' })
  const navigate = useNavigate()
  const { t } = useTranslation()

  const projects = [
    {
      id: 1,
      slug: 'ecommerce-platform',
      title: t('portfolio.projects.ecommerce.title'),
      description: t('portfolio.projects.ecommerce.description'),
      tags: ['React', 'Node.js', 'PostgreSQL'],
      image: 'https://via.placeholder.com/1200x800/DC5C48/ffffff?text=E-commerce+Platform',
      color: '#DC5C48',
      longDescription: 'A comprehensive e-commerce solution built with modern technologies. Features include product catalog, shopping cart, secure checkout, payment integration, order management, and admin dashboard.',
      features: [
        'Product catalog with search and filters',
        'Shopping cart and wishlist',
        'Secure payment integration (Stripe)',
        'Order tracking and history',
        'Admin dashboard for inventory management',
        'User authentication and profiles'
      ],
      technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Stripe API', 'JWT', 'Redux'],
      links: {
        demo: '#',
        github: '#'
      }
    },
    {
      id: 2,
      slug: 'task-manager',
      title: t('portfolio.projects.taskManager.title'),
      description: t('portfolio.projects.taskManager.description'),
      tags: ['Next.js', 'TypeScript', 'MongoDB'],
      image: 'https://via.placeholder.com/1200x800/488B9B/ffffff?text=Task+Manager',
      color: '#488B9B',
      longDescription: 'A collaborative task management application with real-time synchronization. Perfect for teams to organize projects, assign tasks, and track progress.',
      features: [
        'Real-time task updates',
        'Team collaboration features',
        'Project boards and timelines',
        'Task assignments and priorities',
        'File attachments and comments',
        'Activity notifications'
      ],
      technologies: ['Next.js', 'TypeScript', 'MongoDB', 'Socket.io', 'Tailwind CSS', 'NextAuth'],
      links: {
        demo: '#',
        github: '#'
      }
    },
    {
      id: 3,
      slug: 'analytics-dashboard',
      title: t('portfolio.projects.analytics.title'),
      description: t('portfolio.projects.analytics.description'),
      tags: ['React', 'D3.js', 'Express'],
      image: 'https://via.placeholder.com/1200x800/9B6B48/ffffff?text=Analytics+Dashboard',
      color: '#9B6B48',
      longDescription: 'An interactive analytics dashboard for visualizing business metrics and KPIs. Features beautiful charts, real-time data updates, and customizable widgets.',
      features: [
        'Interactive data visualizations',
        'Real-time metrics updates',
        'Customizable dashboard widgets',
        'Export reports to PDF/Excel',
        'Multiple chart types',
        'Date range filtering'
      ],
      technologies: ['React', 'D3.js', 'Express', 'PostgreSQL', 'Chart.js', 'Material-UI'],
      links: {
        demo: '#',
        github: '#'
      }
    },
    {
      id: 4,
      slug: 'social-media-app',
      title: t('portfolio.projects.socialMedia.title'),
      description: t('portfolio.projects.socialMedia.description'),
      tags: ['React Native', 'Firebase', 'Redux'],
      image: 'https://via.placeholder.com/1200x800/5C8ADC/ffffff?text=Social+Media+App',
      color: '#5C8ADC',
      longDescription: 'A modern social networking mobile application built with React Native. Connect with friends, share moments, and engage with content.',
      features: [
        'User profiles and bios',
        'Post creation with photos/videos',
        'Like, comment, and share',
        'Follow/unfollow system',
        'Direct messaging',
        'Push notifications'
      ],
      technologies: ['React Native', 'Firebase', 'Redux', 'Expo', 'Cloud Firestore', 'Cloud Storage'],
      links: {
        demo: '#',
        github: '#'
      }
    }
  ]

  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <div className="page project-detail-page">
        <div className="container">
          <h1>Project not found</h1>
          <button onClick={() => navigate({ to: '/portfolio' })}>Back to Portfolio</button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="page project-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className="back-button"
        onClick={() => navigate({ to: '/portfolio' })}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ x: -5 }}
      >
        ← Back to Portfolio
      </motion.button>

      <div className="project-detail-container">
        <motion.div
          className="project-hero"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="hero-image">
            <img src={project.image} alt={project.title} />
            <div className="hero-overlay" style={{ background: `linear-gradient(180deg, transparent 0%, ${project.color}30 100%)` }} />
          </div>
        </motion.div>

        <motion.div
          className="project-content"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="content-header">
            <h1>{project.title}</h1>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag" style={{ background: project.color }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="long-description">{project.longDescription}</p>

          <div className="project-section">
            <h2>Key Features</h2>
            <ul className="features-list">
              {project.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="project-section">
            <h2>Technologies Used</h2>
            <div className="tech-grid">
              {project.technologies.map((tech, index) => (
                <motion.div
                  key={tech}
                  className="tech-item"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="project-links">
            <motion.a
              href={project.links.demo}
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Live Demo
            </motion.a>
            <motion.a
              href={project.links.github}
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View on GitHub
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ProjectDetail
