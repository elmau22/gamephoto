import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ganti 'nama-repo-anda' dengan nama asli repositori di 
export default defineConfig({
  plugins: [react()],
  base: '/gamephoto/', 
})