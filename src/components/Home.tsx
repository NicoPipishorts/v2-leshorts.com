import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import '../styles/Home.css'

const Home = () => {
  return (
    <motion.div
      className="page home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Hi, I'm <span className="highlight">Nicolas Pisar</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Full Stack Developer & Creative Designer
          </motion.p>

          <motion.p
            className="hero-description"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            I craft beautiful digital experiences with modern technologies.
            Passionate about clean code and intuitive user interfaces.
          </motion.p>

          <motion.div
            className="cta-buttons"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Link to="/portfolio" className="btn btn-primary">
              View My Work
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Get In Touch
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Home
