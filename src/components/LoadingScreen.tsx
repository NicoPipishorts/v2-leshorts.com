import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Logo from './Logo'
import '../styles/LoadingScreen.css'

interface LoadingScreenProps {
  onComplete: () => void
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Wait for logo animation to complete, then trigger exit
    const timer = setTimeout(() => {
      setIsComplete(true)
      setTimeout(onComplete, 800) // Extra time for exit animation
    }, 3500) // Total animation time

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="loading-logo-container"
            initial={{ scale: 1, x: '-50%', y: '-50%' }}
            animate={
              isComplete
                ? {
                    scale: 0.275, // Scale from ~200px to 55px (55/200 = 0.275)
                    x: 'calc(-50vw + 2rem + 27.5px)', // Move to left side (account for padding and half logo width)
                    y: 'calc(-50vh + 1.5rem + 27.5px)', // Move to top (account for navbar padding and half logo height)
                  }
                : { scale: 1, x: '-50%', y: '-50%' }
            }
            transition={{
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            <Logo className="loading-logo" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
