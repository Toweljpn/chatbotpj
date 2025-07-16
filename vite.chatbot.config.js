import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/ChatbotWindow.vue'),
      name: 'ChatbotWidget',
      fileName: (format) => `chatbot-widget.${format}.js`,
    },
    outDir: 'dist/chatbot-widget', // ここを追加
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