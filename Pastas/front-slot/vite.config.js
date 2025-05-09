import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default {
  server: {
    proxy: {
      '/criar-slot': 'http://18.210.183.73:3000',
      '/slot': 'http://18.210.183.73:3000'
    }
  }
};
