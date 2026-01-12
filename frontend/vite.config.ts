import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@pages': '/src/pages',
        '@hooks': '/src/hooks',
        '@stores': '/src/stores',
        '@services': '/src/services',
        '@types': '/src/types',
        '@utils': '/src/utils',
      },
    },
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
    define: {
      // Ensure environment variables are properly injected at build time
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || 'http://localhost:8000'
      ),
    },
  }
})
