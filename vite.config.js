export default {
  base: Deno.env.get("REPO_NAME") || "/project",
    server: {
      hmr: false
    }
  };
  
  