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
        src: "src/assets/Icon.png",
        sizes: "192x192",
        type: "image/png"
      }],
    }
  })],
};
