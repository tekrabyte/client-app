import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/index.html',
        // Avoid caching API requests as static assets
        navigateFallbackDenylist: [/^\/wp-json/, /^https:\/\/erpos\.tekrabyte\.id\/wp-json/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/erpos\.tekrabyte\.id\/wp-json\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-data-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'TekraPOS Mobile',
        short_name: 'TekraPOS',
        description: 'Aplikasi Kasir TekraERPOS',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ["window-controls-overlay"],
        orientation: 'portrait',
        
        // FIXED ICONS SECTION
        icons: [
            { 
              src: '/icon-192.png', 
              sizes: '192x192', 
              type: 'image/png',
              purpose: 'any' // Standard icon
            },
            { 
              src: '/icon-512.png', 
              sizes: '512x512', 
              type: 'image/png',
              purpose: 'any' 
            },
            { 
              src: '/icon-512.png', 
              sizes: '512x512', 
              type: 'image/png',
              purpose: 'maskable' // For Android adaptive icons
            }
        ],

        // NEW SCREENSHOTS SECTION (Fixes "Richer Install UI" warning)
        screenshots: [
          {
            src: '/screen-mobile.png', // Ensure this file exists in public folder
            sizes: '390x844', // Change this to match your actual screenshot size
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Mobile View'
          },
          {
            src: '/screen-desktop.png', // Ensure this file exists in public folder
            sizes: '1920x1080', // Change this to match your actual screenshot size
            type: 'image/png',
            form_factor: 'wide',
            label: 'Desktop Dashboard'
          }
        ]
      } 
    })
  ],
})