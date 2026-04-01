import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/news': {
        target: 'https://newsapi.org',
        changeOrigin: true,
        rewrite: () =>
          `/v2/top-headlines?country=us&category=business&pageSize=20&apiKey=e60f33046b9342d69705f1b76f1e3b3d`,
      },
      '/api/markets': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: () =>
          `/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum&sparkline=true&price_change_percentage=24h`,
      },
    },
  },
})

