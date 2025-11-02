import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "AnimeChat_UI_2.0",
  optimizeDeps: {
    exclude: ['lucide-react']
  }
})