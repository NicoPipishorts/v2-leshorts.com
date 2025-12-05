import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import '../styles/Navigation.css'

const Navigation = () => {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <motion.nav
      className="navigation"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="nav-container">
        <motion.div
          className="logo"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/">NP</Link>
        </motion.div>

        <ul className="nav-links">
          {navItems.map((item, index) => (
            <motion.li
              key={item.to}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link
                to={item.to}
                className="nav-link"
                activeProps={{
                  className: 'active',
                }}
              >
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.nav>
  )
}

export default Navigation
