import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { generateCvPdf, normalizeLanguage } from './server/generateCvPdf.mjs'

const cvPdfApiPlugin = () => ({
  name: 'cv-pdf-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const requestPath = req.url ?? ''
      if (!requestPath.startsWith('/api/cv-pdf')) {
        next()
        return
      }

      if (req.method !== 'GET') {
        res.statusCode = 405
        res.setHeader('Allow', 'GET')
        res.end('Method Not Allowed')
        return
      }

      try {
        const requestUrl = new URL(requestPath, 'http://localhost')
        const lang = normalizeLanguage(requestUrl.searchParams.get('lang'))
        const pdfBuffer = await generateCvPdf({ lang })

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="nicolas-pisar-cv-${lang}.pdf"`,
        )
        res.setHeader(
          'Cache-Control',
          'private, max-age=0, no-cache, no-store, must-revalidate',
        )
        res.end(pdfBuffer)
      } catch (error) {
        console.error('CV PDF generation failed in dev server:', error)
        res.statusCode = 500
        res.end('Failed to generate CV PDF')
      }
    })
  },
})

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    tailwindcss(),
    react(),
    cvPdfApiPlugin(),
  ],
  server: {
    port: 6686,
    strictPort: true,
    open: true,
  },
  preview: {
    port: 6686,
    strictPort: true,
  },
})
