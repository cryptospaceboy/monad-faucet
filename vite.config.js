import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // No proxy needed for live deployment
    host: true,      // Allows accessing on local network (optional)
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
})