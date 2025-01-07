import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql':
      {
        target:'http://localhost:3000',
        secure: false,
        changeOrigin: true,
      }
    }
  }
})
