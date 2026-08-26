import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './', // 相对路径，适配 GitHub Pages 子路径部署（https://user.github.io/repo/）
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',   // 监听所有网络接口，允许局域网访问
    port: 5173,          // 默认端口，可改为 3000 / 8080 等
    open: false,         // 启动后不自动打开浏览器（设为 true 则自动打开）
  },
  preview: {
    host: '0.0.0.0',   // npm run preview 也允许局域网访问
    port: 4173,          // 预览默认端口
  },
})
