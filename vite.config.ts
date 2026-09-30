import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import {
  generateCvPdf,
  normalizeLanguage,
  normalizeVariant,
} from './server/generateCvPdf.mjs'
import { sendContact } from './server/sendContact.mjs'

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
        const variant = normalizeVariant(requestUrl.searchParams.get('variant'))
        const pdfBuffer = await generateCvPdf({ lang, variant })

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="nicolas-pisar-cv-${variant}-${lang}.pdf"`,
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

// Dev twin of api/contact.js; reads RESEND_API_KEY / CONTACT_TO from .env.local
const contactApiPlugin = (env: Record<string, string>) => ({
  name: 'contact-api',
  configureServer(server) {
    server.middlewares.use('/api/contact', async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.end(JSON.stringify({ ok: false, error: 'method_not_allowed' }))
        return
      }
      try {
        let raw = ''
        for await (const chunk of req) raw += chunk
        const { status, body } = await sendContact(JSON.parse(raw || '{}'), env)
        res.statusCode = status
        res.end(JSON.stringify(body))
      } catch (error) {
        console.error('Contact form failed in dev server:', error)
        res.statusCode = 500
        res.end(JSON.stringify({ ok: false, error: 'server_error' }))
      }
    })
  },
})

export default defineConfig(({ mode }) => ({
  plugins: [
    TanStackRouterVite(),
    tailwindcss(),
    react(),
    cvPdfApiPlugin(),
    contactApiPlugin(loadEnv(mode, process.cwd(), '')),
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
}))
