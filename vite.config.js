import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/Varsha/',

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: "Varsha's Progress",
        short_name: "Varsha Progress",
        description: "Varsha's personal daily progress tracker",

        start_url: '/Varsha/',
        scope: '/Varsha/',
        display: 'standalone',

        background_color: '#f6f7ff',
        theme_color: '#6d5dfc',

        icons: [
          {
            src: '/Varsha/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/Varsha/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});