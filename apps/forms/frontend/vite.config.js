import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

// 1. Manually recreate __dirname for the ES Module environment
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 2. Force Node to load the stable CommonJS version of the plugin to bypass the ESM bug
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
      }),
    }),
  ],
})
