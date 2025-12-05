import { motion } from 'framer-motion'
import '../styles/About.css'

const About = () => {
  const skills = [
    'React', 'TypeScript', 'Node.js', 'Next.js',
    'TailwindCSS', 'PostgreSQL', 'MongoDB', 'AWS'
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.div
      className="page about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="about-container">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">About Me</h1>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p>
              I'm a passionate full-stack developer with a keen eye for design
              and a love for creating seamless user experiences. With several
              years of experience in web development, I specialize in building
              modern, scalable applications.
            </p>
            <p>
              My journey in tech started with a curiosity about how things work
              on the web, and has evolved into a career focused on crafting
              elegant solutions to complex problems.
            </p>
            <p>
              When I'm not coding, you can find me exploring new technologies,
              contributing to open-source projects, or sharing knowledge with
              the developer community.
            </p>
          </motion.div>

          <motion.div
            className="skills-section"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2>Skills & Technologies</h2>
            <div className="skills-grid">
              {skills.map((skill) => (
                <motion.div
                  key={skill}
                  className="skill-item"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default About
