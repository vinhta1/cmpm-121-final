import {VitePWA} from "vite-plugin-pwa"

export default {
  base: Deno.env.get("REPO_NAME") || "/project",
  server: {
    hmr: false,
  },
  plugins:[VitePWA({
    manifest:{
      registerType: 'autoUpdate',
      icons:[{
        src: "/src/assets/crops/Crops15.png",
        sizes: "16x16",
        type: "image/png"
      }],
    }
  })],
};
