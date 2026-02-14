import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,  // Промени тук
    proxy: {
      '/api': {
        target: 'http://localhost:5001',  // Промени тук
        changeOrigin: true
      }
    }
  }
})

