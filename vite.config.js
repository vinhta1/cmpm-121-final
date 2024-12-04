import {VitePWA} from "vite-plugin-pwa"

export default {
  base: Deno.env.get("REPO_NAME") || "/project",
  server: {
    hmr: false,
  },
  plugins:[VitePWA({
    registerType: 'autoUpdate',
    includeAssets: [new URL('/src/assets/Icon.png', import.meta.url).href],
    manifest:{
      name: 'Farming-Game',
      short_name: 'FG',
      icons:[{
        src: new URL('/src/assets/Icon.png', import.meta.url).href,
        sizes: "192x192",
        type: "image/png"
      }],
    }
  })],
};
