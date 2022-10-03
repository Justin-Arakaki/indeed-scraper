import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'frontend',
  publicDir: 'backend/server/public',
  base: '/backend/server/public',
  build: {
    outDir: '../backend/server/public'
  }
})
