import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        popup: 'popup.html',
        background: 'src/background.ts'
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Ensure background.ts is built as background.js
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          return '[name]-[hash].js';
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
  }
});