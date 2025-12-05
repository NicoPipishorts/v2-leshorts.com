import { motion } from 'framer-motion'
import '../styles/Portfolio.css'

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-featured online shopping platform with cart, checkout, and payment integration.',
      tags: ['React', 'Node.js', 'PostgreSQL'],
      image: 'https://via.placeholder.com/400x300/667eea/ffffff?text=E-commerce'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative task management tool with real-time updates and team features.',
      tags: ['Next.js', 'TypeScript', 'MongoDB'],
      image: 'https://via.placeholder.com/400x300/764ba2/ffffff?text=Task+Manager'
    },
    {
      id: 3,
      title: 'Analytics Dashboard',
      description: 'Data visualization dashboard with interactive charts and real-time metrics.',
      tags: ['React', 'D3.js', 'Express'],
      image: 'https://via.placeholder.com/400x300/f093fb/ffffff?text=Analytics'
    },
    {
      id: 4,
      title: 'Social Media App',
      description: 'Modern social networking platform with posts, comments, and user profiles.',
      tags: ['React Native', 'Firebase', 'Redux'],
      image: 'https://via.placeholder.com/400x300/4facfe/ffffff?text=Social+App'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  }

  return (
    <motion.div
      className="page portfolio-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="portfolio-container">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">My Portfolio</h1>
          <p className="page-subtitle">
            A collection of projects I've worked on
          </p>
        </motion.div>

        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="project-card"
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Portfolio
