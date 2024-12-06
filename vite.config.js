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
      short_name: 'FG',
      icons:[{
        src: "/cmpm-121-final/Icon.png",
        sizes: "192x192",
        type: "image/png"
      }],
    }
  })],
};
