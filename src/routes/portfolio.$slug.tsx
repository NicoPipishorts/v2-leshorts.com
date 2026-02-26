import { createFileRoute } from '@tanstack/react-router'
import ProjectDetail from '../components/ProjectDetail'

export const Route = createFileRoute('/portfolio/$slug')({
  component: ProjectDetail,
})
