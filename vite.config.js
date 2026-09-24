import react from '@vitejs/plugin-react'; // Changed this line
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()], // Uses the correct react plugin
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'https://onrender.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '') 
        },
      },
    },
  };
});
