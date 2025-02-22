import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Ensure Vite looks in the root directory
  build: {
    rollupOptions: {
      input: 'index.html', // Explicitly set entry point
    },
    outDir: 'dist', // Output folder
  },
});
