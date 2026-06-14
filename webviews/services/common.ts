import * as categoryListV5 from "../data/fontawesome-5/metadata/categories.json";
import * as iconsV6 from "../data/fontawesome-6/metadata/icons.json";
import * as iconsV7 from "../data/fontawesome-7/metadata/icons.json";
import type { CategoryEntry, IconCollection } from ".";

// ---- v5 legacy categories ----

interface CategoryCollectionV5 {
  [key: string]: CategoryEntry;
}

const categoryListV5Typed = categoryListV5 as CategoryCollectionV5;

// ---- v6/v7 categories ----

function getCollectionForVersion(faVersion: string): IconCollection {
  if (faVersion === "v7") return iconsV7 as unknown as IconCollection;
  return iconsV6 as unknown as IconCollection;
}

// ---- Public API ----

export interface FullCategory {
  name: string;
  label: string;
  icons: string[];
}

export function getIconCategories(faVersion: string): FullCategory[] {
  if (faVersion === "v5") {
    return Object.entries(categoryListV5Typed)
      .filter(([key]) => key !== "default")
      .map(([key, entry]) => ({ name: key, label: entry.label, icons: entry.icons }));
  }

  const collection = getCollectionForVersion(faVersion);
  return Object.entries(collection.categories).map(([key, entry]) => ({
    name: key,
    label: entry.label,
    icons: entry.icons,
  }));
}

// Used by list.ts for category-scoped browsing.
// For v5 we use the global categoryList set by the last getIconCategories call.
let _lastV5Categories: CategoryCollectionV5 = categoryListV5Typed;

export function getIconsByCategory(target: string): CategoryEntry {
  for (const [key, entry] of Object.entries(_lastV5Categories)) {
    if (key === target) return entry;
  }
  return { label: "", icons: [] };
}
