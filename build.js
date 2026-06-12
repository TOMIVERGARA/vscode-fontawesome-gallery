const esbuild = require("esbuild");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

async function build() {
  const { default: sveltePlugin } = await import("esbuild-svelte");

  const extensionCtx = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    outfile: "dist/extension.js",
    external: ["vscode"],
    format: "cjs",
    platform: "node",
    sourcemap: !production,
    minify: production,
    logLevel: "info",
  });

  const webviewCtx = await esbuild.context({
    entryPoints: ["webviews/pages/Sidebar.ts"],
    bundle: true,
    outdir: "out/compiled",
    format: "iife",
    platform: "browser",
    sourcemap: !production,
    minify: production,
    plugins: [sveltePlugin({ compilerOptions: { dev: !production } })],
    loader: { ".json": "json" },
    logLevel: "info",
  });

  if (watch) {
    await Promise.all([extensionCtx.watch(), webviewCtx.watch()]);
    console.log("Watching for changes...");
  } else {
    await Promise.all([extensionCtx.rebuild(), webviewCtx.rebuild()]);
    await extensionCtx.dispose();
    await webviewCtx.dispose();
  }
}

build().catch(() => process.exit(1));
