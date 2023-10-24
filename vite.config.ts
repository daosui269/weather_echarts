import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import px2rem from 'postcss-plugin-px2rem'
import autoprefixer from 'autoprefixer'

import mkcert from 'vite-plugin-mkcert'
import viteCompression from 'vite-plugin-compression'; // gzip

// 配置基本大小
const postcss = px2rem({
  "rootValue": 192,
  "exclude": "/node_modules/"
});

export default defineConfig({
  plugins: [
    vue(),
    mkcert(),
    viteCompression({
      verbose: true,   // 是否在控制台输出压缩结果
      disable: false,   // 是否禁用
      threshold: 1024 * 10,   // 压缩的门槛大小
      algorithm: 'gzip',   // 压缩的算法
      ext: '.gz',  // 压缩后的文件扩展名
      deleteOriginFile: true, // 压缩后是否删除源文件
      // filter: ''  // 指定哪些资源不被压缩
    })
  ],
  build: {
    rollupOptions: {
      output: {
      // 对静态资源进行单独打包
        assetFileNames: 'static/[ext]/[name].[hash].[ext]',
        // 对项目依赖进行单独打包
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vandor'
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 代理
  server: {
    https: false,
    proxy: {
      '/api': {
        // target: 'http://127.0.0.1:3000',
        target: 'https://apis.map.qq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), postcss]
    },
  },
  // 去掉debugger
  esbuild: {
    drop: ['console', 'debugger']
  },
    // base:'./', // 生产环境
    base: '/',  // 上线后
})
