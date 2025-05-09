import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default {
  server: {
    proxy: {
      '/criar-slot': 'http://localhost:3000',
      '/slot': 'http://localhost:3000'
    }
  }
};
