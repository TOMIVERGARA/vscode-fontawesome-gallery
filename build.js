const esbuild = require("esbuild");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/**
 * Emits `[watch] build started/finished` markers and formats errors so the
 * VS Code background problemMatcher (see .vscode/tasks.json) can detect when
 * each rebuild begins and ends.
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: "esbuild-problem-matcher",
  setup(build) {
    build.onStart(() => console.log("[watch] build started"));
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        if (location) {
          console.error(`    ${location.file}:${location.line}:${location.column}:`);
        }
      });
      console.log("[watch] build finished");
    });
  },
};

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
    logLevel: "silent",
    plugins: [esbuildProblemMatcherPlugin],
  });

  const webviewCtx = await esbuild.context({
    entryPoints: ["webviews/pages/Sidebar.ts"],
    bundle: true,
    outdir: "out/compiled",
    format: "iife",
    platform: "browser",
    sourcemap: !production,
    minify: production,
    plugins: [
      sveltePlugin({ compilerOptions: { dev: !production } }),
      esbuildProblemMatcherPlugin,
    ],
    loader: { ".json": "json" },
    logLevel: "silent",
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
