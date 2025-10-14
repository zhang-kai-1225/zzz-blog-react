import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    // 配置路径别名
    alias:{
      '@': path.resolve(__dirname, './src'),// 配置@指向src目录
    }
  }
})
