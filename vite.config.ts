import { defineConfig, loadEnv } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { VitePWA } from "vite-plugin-pwa";
import ViteRadar from "vite-plugin-radar";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));

  return defineConfig({
    plugins: [
      reactRefresh(),
      VitePWA({
        manifest: {
          name: "SC2-Malaysia Tracker",
          short_name: "SC2-Malaysia Tracker",
          description: "Track status of COVID-19 in Malaysia",
          display: "standalone",
          icons: [
            {
              src: "/packs/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/packs/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
          theme_color: "#856bdb",
          background_color: "#856bdb",
          start_url: "sc2.izzatfaris.site/?src=pwa",
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
      ViteRadar({
        enableDev: true,
        analytics: {
          id: process.env.VITE_GOOGLE_TAG_ID,
        },
      }),
    ],
    build: {
      rollupOptions: {
        plugins: [
          visualizer({
            open: process.env.ANALYZE_BUNDLE ? true : false,
            gzipSize: true,
            brotliSize: true,
          }),
        ],
      },
    },

    css: {
      modules: {
        scopeBehaviour: "local",
      },
      postcss: {
        plugins: [
          require("tailwindcss/nesting"),
          require("tailwindcss"),
          require("autoprefixer"),
        ],
      },
    },
  });
};
