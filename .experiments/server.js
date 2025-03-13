import { loadNuxt, build } from "nuxt";
import express from "express";

const app = express();
const PORT = process?.env?.PORT || 3010;

async function start() {
  const nuxt = await loadNuxt("start");

  // Build only in development
  if (process.env.NODE_ENV !== "production") {
    await build(nuxt);
  }

  // Use Nuxt's rendering engine
  app.use(nuxt.render);

  // Listen on a port
  app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on :${PORT}`));
}

start();
