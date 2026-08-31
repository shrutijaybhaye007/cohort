import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Render / Netlify static hosts need the SPA fallback set at the host level
    // (already done in render.yaml routes and netlify.toml redirects)
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    // Local dev: proxy /api calls to the backend so CORS isn't needed in dev
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
