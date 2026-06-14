import * as iconsListV5 from "../data/fontawesome-5/metadata/fagIcons.json";
import * as searchIndexV5 from "../data/fontawesome-5/metadata/searchIndexArray.json";
import * as iconsV6 from "../data/fontawesome-6/metadata/icons.json";
import * as iconsV7 from "../data/fontawesome-7/metadata/icons.json";
import Icon from "./icon";
import type { IconEntry, IconCollection, IconEntryV5, CategoryEntry } from ".";
import { getIconsByCategory } from "../services/common";

// ---- Legacy v5 types ----

interface IconEntryCollectionV5 {
  [key: string]: IconEntryV5;
}

interface SearchIndexEntryV5 {
  name: string;
  label: string;
  searchTerms: string[];
}

// ---- Scored search result ----

interface ScoredEntry {
  name: string;
  score: number;
}

export default class IconList {
  public readonly faVersion: string;
  icons: Icon[];
  globalIdx: number = 0;

  // v5 state
  private searchIndexV5: SearchIndexEntryV5[];
  private iconEntriesV5: IconEntryCollectionV5;

  // v6/v7 state
  private iconCollection: IconCollection | null;
  private iconNames: string[]; // sorted list of all icon names

  constructor(faVersion: string) {
    this.faVersion = faVersion;
    this.icons = [];

    // v5 (legacy format)
    this.searchIndexV5 = searchIndexV5.searchIndexArray as SearchIndexEntryV5[];
    this.iconEntriesV5 = iconsListV5 as IconEntryCollectionV5;

    // v6/v7 (new SVG format)
    if (faVersion === "v7") {
      this.iconCollection = iconsV7 as unknown as IconCollection;
    } else {
      this.iconCollection = iconsV6 as unknown as IconCollection;
    }
    this.iconNames = this.iconCollection
      ? Object.keys(this.iconCollection.icons)
      : [];
  }

  // ---- v5 helpers ----

  private listFromV5Entry(iconName: string) {
    const key = `fag_${iconName.replace(/-/g, "_")}`;
    const entry = this.iconEntriesV5[key];
    if (!entry?.styles) return;
    for (const style of entry.styles) {
      this.icons.push(new Icon(entry.name, entry.unicode, entry.label, style, undefined, entry.styles));
    }
  }

  // ---- v6/v7 helpers ----

  private listFromEntry(iconName: string) {
    const entry: IconEntry | undefined = this.iconCollection!.icons[iconName];
    if (!entry?.styles) return;
    for (const style of entry.styles) {
      this.icons.push(
        new Icon(iconName, entry.unicode, entry.label, style, entry.svg[style as keyof typeof entry.svg], entry.styles, entry.added_in ?? undefined)
      );
    }
  }

  public getIconByKey(key: string): Icon | null {
    const [name, style] = key.split(":");
    if (!name || !style) return null;
    if (this.faVersion === "v5") {
      const v5key = `fag_${name.replace(/-/g, "_")}`;
      const entry = this.iconEntriesV5[v5key];
      if (!entry) return null;
      return new Icon(entry.name, entry.unicode, entry.label, style, undefined, entry.styles);
    }
    const entry = this.iconCollection?.icons[name];
    if (!entry) return null;
    return new Icon(name, entry.unicode, entry.label, style, entry.svg[style as keyof typeof entry.svg], entry.styles, entry.added_in ?? undefined);
  }

  // ---- Search (v6/v7) ----

  /**
   * Score an icon against a query. Matches on the icon name rank higher than
   * matches on search terms so that "github" → github icon beats code-branch.
   *
   *  Scores:
   *   100 — icon name exact match
   *    95 — label exact match
   *    90 — search term exact match
   *    80 — icon name starts with query
   *    70 — label/term starts with query
   *    60 — icon name contains query (substring)
   *    50 — label/term contains query (substring)
   *    30 — fuzzy subsequence on icon name
   *    20 — fuzzy subsequence on label/term
   */
  private scoreIcon(iconName: string, entry: IconEntry, query: string): number {
    const q = query.toLowerCase().trim();
    if (!q) return 100;

    const name = iconName;
    const label = entry.label.toLowerCase();
    const terms = entry.searchTerms;

    // Name-level checks (highest priority)
    if (name === q) return 100;
    if (name.startsWith(q)) return 80;
    if (name.includes(q)) return 60;

    // Label
    if (label === q) return 95;
    if (label.startsWith(q)) return 70;
    if (label.includes(q)) return 50;

    // Search terms
    let best = 0;
    for (const term of terms) {
      if (term === q) { best = Math.max(best, 90); continue; }
      if (term.startsWith(q)) { best = Math.max(best, 70); continue; }
      if (term.includes(q)) { best = Math.max(best, 50); continue; }
    }
    if (best > 0) return best;

    // Fuzzy subsequence on name
    let qi = 0;
    for (let i = 0; i < name.length && qi < q.length; i++) {
      if (name[i] === q[qi]) qi++;
    }
    if (qi === q.length) return 30;

    // Fuzzy subsequence on label and terms
    for (const term of [label, ...terms]) {
      qi = 0;
      for (let i = 0; i < term.length && qi < q.length; i++) {
        if (term[i] === q[qi]) qi++;
      }
      if (qi === q.length) return 20;
    }

    return 0;
  }

  private searchV6(query: string): ScoredEntry[] {
    const results: ScoredEntry[] = [];
    for (const name of this.iconNames) {
      const entry = this.iconCollection!.icons[name];
      const score = this.scoreIcon(name, entry, query);
      if (score > 0) results.push({ name, score });
    }
    results.sort((a, b) => b.score - a.score);
    return results;
  }

  // ---- Legacy v5 search ----

  private searchV5(filter: string): SearchIndexEntryV5[] {
    const q = filter.toLowerCase();
    return this.searchIndexV5.filter((icon) => {
      if (icon.label.toLowerCase().includes(q)) return true;
      for (const term of icon.searchTerms) {
        if (term.toLowerCase().includes(q)) return true;
      }
      return false;
    });
  }

  // ---- Public API ----

  public generateList(category: string): Icon[] {
    this.icons = [];
    if (this.faVersion === "v5") {
      if (category === "all") {
        for (let i = 0; i < 100; i++) {
          this.globalIdx = i;
          this.listFromV5Entry(this.searchIndexV5[i].name);
        }
      } else {
        const cat: CategoryEntry = getIconsByCategory(category);
        for (const icon of cat.icons) this.listFromV5Entry(icon);
      }
      return this.icons;
    }

    // v6/v7
    if (category === "all") {
      for (let i = 0; i < 100; i++) {
        this.globalIdx = i;
        this.listFromEntry(this.iconNames[i]);
      }
    } else {
      const cats = this.iconCollection!.categories;
      const cat = cats[category];
      if (cat) {
        for (const name of cat.icons) this.listFromEntry(name);
      }
    }
    return this.icons;
  }

  public loadMoreIcons(): Icon[] {
    const start = this.globalIdx + 1;
    if (this.faVersion === "v5") {
      for (let i = start; i < start + 100; i++) {
        this.globalIdx = i;
        if (i >= this.searchIndexV5.length) break;
        this.listFromV5Entry(this.searchIndexV5[i].name);
      }
    } else {
      for (let i = start; i < start + 100; i++) {
        this.globalIdx = i;
        if (i >= this.iconNames.length) break;
        this.listFromEntry(this.iconNames[i]);
      }
    }
    return this.icons;
  }

  public filterIcons(filter: string): Icon[] {
    this.icons = [];
    if (this.faVersion === "v5") {
      for (const entry of this.searchV5(filter)) {
        this.listFromV5Entry(entry.name);
      }
    } else {
      for (const { name } of this.searchV6(filter)) {
        this.listFromEntry(name);
      }
    }
    return this.icons;
  }

  public getTotal(): number {
    if (this.faVersion === "v5") return this.searchIndexV5.length;
    return this.iconNames.length;
  }
}
