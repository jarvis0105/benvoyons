import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        /* Les bibliothèques sont isolées dans leurs propres fichiers :
           elles changent rarement, donc le navigateur les garde en
           cache entre deux mises en ligne du site. */
        manualChunks(id: string): string | undefined {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|wouter)[\\/]/.test(id)) {
            return 'react';
          }
          if (
            id.includes('framer-motion') ||
            id.includes('motion-dom') ||
            id.includes('motion-utils')
          ) {
            return 'motion';
          }
          return undefined;
        },
      },
    },
  },
  server: {
    port: Number(process.env.PORT ?? 5173),
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: Number(process.env.PORT ?? 4173),
    host: true,
  },
});
