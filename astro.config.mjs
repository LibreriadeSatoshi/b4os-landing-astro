// astro.config.mjs
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://b4os.dev',
  
  build: {
    format: 'directory'
  },
  
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    }
  },
  
  integrations: [
    icon({
      include: {
        'simple-icons': ['bitcoin'], // Solo Bitcoin de Simple Icons
        'heroicons': ['bolt'], // Para iconos de rayo/lightning
      },
    }),
  ],  
});