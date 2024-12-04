import {VitePWA} from "vite-plugin-pwa"

export default {
  base: Deno.env.get("REPO_NAME") || "/project",
  server: {
    hmr: false,
  },
  plugins:[VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ["**/*.{png}"],
    manifest:{
      name: 'Farming-Game',
      start_url: '/',
      scope: '/',
      short_name: 'FG',
      icons:[{
        src: "/Icon.png",
        sizes: "192x192",
        type: "image/png"
      }],
    }
  })],
};
