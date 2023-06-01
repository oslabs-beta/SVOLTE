import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.json', '.svelte'],
  },
  build: {
    outDir: path.join(__dirname, 'extension/build'),
    target: 'esnext',
    rollupOptions: {
      output: {
        entryFileNames: 'bundle.js',
        chunkFileNames: 'bundle.js',
        assetFileNames: 'bundle.[ext]',
      },
    },
  },
});
