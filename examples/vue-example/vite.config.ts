import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import nodePolyfills from 'rollup-plugin-polyfill-node'

import { URL, fileURLToPath } from 'node:url'

const MODE = process.env.NODE_ENV

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    MODE === 'development'
      ? nodePolyfills({
          include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
        })
      : null
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        // ↓ Needed for build
        nodePolyfills()
      ]
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
