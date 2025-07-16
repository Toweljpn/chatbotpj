import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/chatbot-widget-entry.js'),
      name: 'ChatbotWidget',
      fileName: (format) => `chatbot-widget.${format}.js`,
    },
    outDir: 'chatbot-widget', // dist/ を削除 // ここを追加
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});