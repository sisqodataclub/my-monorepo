import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const require = createRequire(import.meta.url)
const vitePrerender = require('vite-plugin-prerender')

export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: [
        '/',
        '/form'
      ],
      renderer: new vitePrerender.PuppeteerRenderer({
        renderAfterDocumentEvent: 'custom-render-trigger',
        // --- ADDED THIS BLOCK FOR DOCKER COMPATIBILITY ---
        launchOptions: {
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      }),
    }),
  ],
})
