// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Configurar tu dominio aquí - cambia por tu URL de producción
  site: 'https://b4os.dev',
  
  // Configuración para mejor SEO
  build: {
    format: 'directory'
  },
  
  // Configuración básica de Vite
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
  }
});