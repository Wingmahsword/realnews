import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // In dev, /api/news → NewsAPI directly (with the key appended)
      '/api/news': {
        target: 'https://newsapi.org',
        changeOrigin: true,
        rewrite: () =>
          `/v2/top-headlines?country=us&category=business&pageSize=20&apiKey=${process.env.VITE_NEWS_API_KEY ?? 'e60f33046b9342d69705f1b76f1e3b3d'}`,
      },
    },
  },
})
