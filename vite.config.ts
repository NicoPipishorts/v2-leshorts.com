import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { sendContact } from './server/sendContact.mjs'

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
        // Cloudflare's always-pass test secret unless a real one is in .env.local
        const devEnv = { TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA', ...env }
        const { status, body } = await sendContact(JSON.parse(raw || '{}'), devEnv, req.socket.remoteAddress)
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
