import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 确保相对路径，适合各种部署环境
  server: {
    host: '0.0.0.0', // 允许局域网访问，便于移动端测试
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015', // 兼容更多移动端浏览器
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          html2canvas: ['html2canvas']
        }
      }
    }
  }
}) 