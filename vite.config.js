import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import requireTransform from 'vite-plugin-require-transform'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const srcDir = fileURLToPath(new URL('./src/', import.meta.url))

export default defineConfig({
  // App 本地 HTTP 服务与 CDN 均按绝对 /assets/... 解析（勿用 file://）
  base: '/',
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver({ importStyle: true })],
      dts: false
    }),
    requireTransform({
      fileRegex: /\.(js|jsx|vue)$/
    })
  ],
  resolve: {
    alias: [
      { find: /^@\//, replacement: srcDir }
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  css: {
    preprocessorOptions: {
      less: {
        // 仅注入色板变量，避免把全局规则重复打进每个 SFC
        additionalData: `@import "@/assets/styles/theme-tokens.less";`,
        javascriptEnabled: true
      }
    }
  },
  server: {
    host: true,
    port: 8080,
    // 本地备用代理（优先直连 us 域名；若仍走 /a 则转到 us）
    proxy: {
      '/a': {
        target: 'https://us.luckyhubx.cc',
        changeOrigin: true,
        secure: false,
        timeout: 60000
      }
    }
  },
  optimizeDeps: {
    include: ['js-md5']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    cssCodeSplit: true,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('vant')) return 'vant'
          if (
            id.includes('/vue/') ||
            id.includes('/vue-router/') ||
            id.includes('/vuex/') ||
            id.includes('/vue-i18n/') ||
            id.includes('@vue/')
          ) {
            return 'vue-vendor'
          }
          if (id.includes('lottie-web')) return 'lottie'
          if (id.includes('@fingerprintjs')) return 'fingerprint'
          if (id.includes('axios')) return 'axios'
          if (id.includes('dayjs')) return 'dayjs'
        }
      }
    }
  }
})
