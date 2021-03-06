import { defineConfig, loadEnv } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { VitePWA } from "vite-plugin-pwa";
import ViteRadar from "vite-plugin-radar";
import { visualizer } from "rollup-plugin-visualizer";
import ViteFonts from "vite-plugin-fonts";
import htmlPlugin from "vite-plugin-html-config";

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
          theme_color: "#F1EFFB",
          background_color: "#F1EFFB",
          start_url: "/?src=pwa",
          scope: "/",
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
      ViteFonts({
        google: {
          families: [
            { name: "Merriweather", styles: "wght@700" },
            { name: "Oswald" },
            {
              name: "Montserrat",
              styles: "wght@500",
            },
          ],
        },
      }),
      htmlPlugin({
        metas: [
          {
            name: "og:title",
            content: "Malaysia SARS-CoV-2 Tracker",
          },
          {
            name: "og:description",
            content:
              "Dashboard for keeping track of COVID-19 cases, deaths and vaccination status in Malaysia",
          },
          {
            name: "og:image",
            content: "/app-logo.png",
          },
          {
            name: "og:url",
            content: "https://sc2.izzatfaris.site",
          },
          {
            name: "og:type",
            content: "website",
          },
          {
            name: "twitter:card",
            content: "summary",
          },
          {
            name: "twitter:site",
            content: "DoReVo",
          },
          {
            name: "twitter:creator",
            content: "DoReVo",
          },
          {
            name: "twitter:title",
            content: "Malaysia SARS-CoV-2 Tracker",
          },
          {
            name: "twitter:description",
            content:
              "Dashboard for keeping track of COVID-19 cases, deaths and vaccination status in Malaysia",
          },
          {
            name: "twitter:image",
            content: "/app-logo.png",
          },
        ],
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
        output: {
          manualChunks: {
            lodash: ["lodash-es"],
            recharts: ["recharts"],
            luxon: ["luxon"],
          },
        },
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
