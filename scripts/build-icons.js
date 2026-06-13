// @ts-check
"use strict";

/**
 * Generates webviews/data/fontawesome-{6,7}/metadata/icons.json
 * from the official FA npm packages.
 *
 * Data sources:
 *   FA v6 → node_modules/fa-free-v6   (npm alias: @fortawesome/fontawesome-free@^6)
 *   FA v7 → node_modules/@fortawesome/fontawesome-free
 *
 * Output format per version:
 * {
 *   metadata: { version, generatedAt },
 *   icons: { [name]: { label, unicode, styles, searchTerms, svg: { solid?, regular?, brands? } } },
 *   categories: { [key]: { label, icons[] } }
 * }
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ROOT = path.resolve(__dirname, "..");

const VERSIONS = [
  {
    id: "v6",
    packageDir: path.join(ROOT, "node_modules/fa-free-v6"),
    outputDir: path.join(ROOT, "webviews/data/fontawesome-6/metadata"),
  },
  {
    id: "v7",
    packageDir: path.join(ROOT, "node_modules/@fortawesome/fontawesome-free"),
    outputDir: path.join(ROOT, "webviews/data/fontawesome-7/metadata"),
  },
];

function toTitleCase(str) {
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildIconsJson(version) {
  const { id, packageDir, outputDir } = version;

  const pkgVersion = JSON.parse(
    fs.readFileSync(path.join(packageDir, "package.json"), "utf8")
  ).version;

  console.log(`\n[${id}] Building from @fortawesome/fontawesome-free@${pkgVersion}`);

  // --- Icons ---
  const rawIcons = JSON.parse(
    fs.readFileSync(path.join(packageDir, "metadata/icon-families.json"), "utf8")
  );

  const icons = {};

  for (const [name, data] of Object.entries(rawIcons)) {
    const freeStyles = (data.familyStylesByLicense?.free ?? []).map((s) => s.style);
    if (freeStyles.length === 0) continue;

    const svgs = {};
    for (const style of freeStyles) {
      const svgData = data.svgs?.classic?.[style];
      if (svgData) {
        svgs[style] = {
          path: svgData.path,
          width: svgData.width,
          height: svgData.height,
        };
      }
    }

    const rawTerms = data.search?.terms ?? [];
    const searchTerms = Array.from(
      new Set(
        [name, data.label ?? toTitleCase(name), ...rawTerms].map((t) =>
          t.toLowerCase()
        )
      )
    );

    icons[name] = {
      label: data.label ?? toTitleCase(name),
      unicode: data.unicode,
      styles: freeStyles,
      searchTerms,
      svg: svgs,
    };
  }

  // --- Categories ---
  const rawCats = yaml.load(
    fs.readFileSync(path.join(packageDir, "metadata/categories.yml"), "utf8")
  );

  const categories = {};
  for (const [key, data] of Object.entries(rawCats)) {
    // only include icons that exist in the free set
    const filteredIcons = (data.icons ?? []).filter((name) => icons[name]);
    if (filteredIcons.length === 0) continue;
    categories[key] = {
      label: data.label ?? toTitleCase(key),
      icons: filteredIcons,
    };
  }

  // --- Write output ---
  fs.mkdirSync(outputDir, { recursive: true });
  const output = {
    metadata: { version: pkgVersion, generatedAt: new Date().toISOString() },
    icons,
    categories,
  };

  const outPath = path.join(outputDir, "icons.json");
  fs.writeFileSync(outPath, JSON.stringify(output));

  const iconCount = Object.keys(icons).length;
  const catCount = Object.keys(categories).length;
  console.log(`[${id}] Done: ${iconCount} icons, ${catCount} categories → ${outPath}`);
}

for (const version of VERSIONS) {
  buildIconsJson(version);
}

console.log("\nAll versions built successfully.");
