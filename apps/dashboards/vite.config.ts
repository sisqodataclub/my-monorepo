import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    // 👇 This is the magic bullet for pnpm monorepos
    dedupe: ['react', 'react-dom', 'framer-motion'],
  }
})
