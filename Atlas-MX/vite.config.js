import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // La geometría de los 32 estados (INEGI) es un bloque de datos grande por naturaleza.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'vendor-react';
          if (id.includes('d3-') || id.includes('topojson')) return 'vendor-geo';
          return undefined;
        }
      }
    }
  }
});
