export enum IconStyle {
  solid = "solid",
  regular = "regular",
  brands = "brands",
}

export const iconStylePrefix: { [style in IconStyle]: string } = {
  [IconStyle.solid]: "fas",
  [IconStyle.regular]: "far",
  [IconStyle.brands]: "fab",
};

export const iconStyleClassV6: { [style in IconStyle]: string } = {
  [IconStyle.solid]: "fa-solid",
  [IconStyle.regular]: "fa-regular",
  [IconStyle.brands]: "fa-brands",
};

export const prefix = "fa-";

// ---- New unified icon data format (v6/v7) ----

export interface SvgData {
  path: string;
  width: number;
  height: number;
}

export interface IconEntry {
  label: string;
  unicode: string;
  styles: string[];
  searchTerms: string[];
  svg: {
    solid?: SvgData;
    regular?: SvgData;
    brands?: SvgData;
  };
  added_in?: string | null;
}

export interface IconCollection {
  metadata: { version: string; generatedAt: string };
  icons: { [name: string]: IconEntry };
  categories: { [key: string]: CategoryEntry };
}

export interface CategoryEntry {
  label: string;
  icons: string[];
}

// ---- Legacy v5 types (kept for backward compatibility) ----

export interface IconEntryV5 {
  name: string;
  changes: string[];
  search: { terms: string[] };
  styles: string[];
  unicode: string;
  label: string;
}

export const vscode = acquireVsCodeApi();
