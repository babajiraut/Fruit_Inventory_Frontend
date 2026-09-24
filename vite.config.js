import react from '@vitejs/react-refresh'; // Or '@vitejs/plugin-react' if using standard React
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file from the current directory based on the active mode (development/production)
  // The third argument '' loads all variables, regardless of the VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // This targets any frontend request starting with '/api'
        '/api': {
          // It reads VITE_API_URL from your local .env file.
          // Falls back to localhost if the variable isn't found.
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          // Optional: Removes '/api' from the path before sending to backend 
          // (Only uncomment the line below if your backend DOES NOT use '/api' in its routes)
          // rewrite: (path) => path.replace(/^\/api/, '')
        },
      },
    },
  };
});
