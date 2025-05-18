// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    server: {
        host: true
    },
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true, // ⬅️ ensures manifest is available in dev
            },
            manifest: {
                name: 'Surakarta Heritage',
                short_name: 'Surakarta',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#0d6efd',
                icons: [
                    {
                        src: '/web-app-manifest-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    }
                ]
            }
        })
    ]
});
