import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH lets the GitHub Pages workflow build for the /<repo>/ subpath.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
