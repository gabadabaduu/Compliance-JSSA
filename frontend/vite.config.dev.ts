import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
            '/hubs': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
                ws: true,
            },
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'reactflow'],
    },
})