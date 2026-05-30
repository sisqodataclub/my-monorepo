import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePrerender from 'vite-plugin-prerender'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      // 1. Point the plugin to your build output directory
      staticDir: path.join(__dirname, 'dist'),
      
      // 2. List the specific routes Google needs to index
      routes: [
        '/',
        '/form'
      ],
      
      // 3. Instruct the headless browser to wait for your React app 
      // to fully render and inject the Helmet SEO tags before taking the snapshot.
      renderer: new vitePrerender.PuppeteerRenderer({
        renderAfterDocumentEvent: 'custom-render-trigger',
      }),
    }),
  ],
})
