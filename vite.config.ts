import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    modulePreload: {
      resolveDependencies(_filename, deps) {
        // Exclude deferred chunks (motion, etc.) from initial HTML modulepreload
        return deps.filter(dep => !dep.includes('vendor-motion'));
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react/') ||
              id.includes('react-dom/') ||
              id.includes('react-router') ||
              id.includes('scheduler')
            ) {
              return 'vendor-react';
            }
            if (id.includes('motion')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-misc';
          }
          if (
            id.includes('src/data') ||
            id.includes('src/lib') ||
            id.includes('src/services')
          ) {
            return 'domain-services';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
