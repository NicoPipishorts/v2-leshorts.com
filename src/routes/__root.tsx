import { createRootRoute, Outlet } from '@tanstack/react-router'
import Navigation from '../components/Navigation'

export const Route = createRootRoute({
  component: () => (
    <>
      <Navigation />
      <Outlet />
    </>
  ),
})
