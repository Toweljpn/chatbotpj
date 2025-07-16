import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // チャットボットをライブラリとしてビルドするための設定
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/ChatbotWindow.vue'),
      name: 'ChatbotWidget',
      fileName: (format) => `chatbot-widget.${format}.js`,
    },
    rollupOptions: {
      // 外部化する依存関係をここにリストします
      external: ['vue'],
      output: {
        // 外部化された依存関係のグローバル変数を設定します
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})

