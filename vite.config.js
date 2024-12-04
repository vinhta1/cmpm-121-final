import {VitePWA} from "vite-plugin-pwa"

export default {
  base: Deno.env.get("REPO_NAME") || "/project",
  server: {
    hmr: false,
  },
  plugins:[VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['src/assets/Icon.png'],
    manifest:{
      name: 'Farming-Game',
      short_name: 'FG',
      icons:[{
        src: "src/assets/Icon.png",
        sizes: "192x192",
        type: "image/png"
      }],
    }
  })],
};
