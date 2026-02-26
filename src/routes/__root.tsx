import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import LoadingScreen from '../components/LoadingScreen'

const RootComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check if we've already shown the loading screen in this session
    const hasSeenLoading = sessionStorage.getItem('hasSeenLoading')

    if (hasSeenLoading) {
      setIsLoading(false)
      setShowContent(true)
    }
  }, [])

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasSeenLoading', 'true')
    setIsLoading(false)
    setTimeout(() => setShowContent(true), 100)
  }

  useEffect(() => {
    document.body.classList.toggle('mobile-nav-open', isMobileMenuOpen)

    return () => {
      document.body.classList.remove('mobile-nav-open')
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      {showContent && (
        <>
          <Navigation
            mobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={() => setIsMobileMenuOpen((current) => !current)}
            onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
          />
          <main className={`app-content${isMobileMenuOpen ? ' mobile-menu-open' : ''}`}>
            <Outlet />
          </main>
        </>
      )}
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
