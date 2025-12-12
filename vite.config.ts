import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 'base' is set to './' to support deployment to subdirectories (like GitHub Pages)
  base: './',
});