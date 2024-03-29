import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve as pathResolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': pathResolve(__dirname, 'src'),
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      toplevel: true,
      ecma: 2020,
      format: {
        ecma: 2020,
        indent_level: 2,
      },
      compress: {
        drop_console: true,
        ecma: 2020,
      },
    },
  },
})
