/**
 * Available FontAwesome icon styles.
 * @see https://fontawesome.com/how-to-use
 */
 export enum IconStyle {
    solid = 'solid',
    regular = 'regular',
    light = 'light',
    brands = 'brands',
    duotone = 'duotone'
}

/**
 * Available FontAwesome icon style prefixes.
 * @see https://fontawesome.com/how-to-use
 */
 export const iconStylePrefix: {[style in IconStyle]: string} =  {
    [IconStyle.solid]: 'fas',
    [IconStyle.regular]: 'far',
    [IconStyle.light]: 'fal',
    [IconStyle.brands]: 'fab',
    [IconStyle.duotone]: 'fad'
};

/**
 * Represents the stucture of an icon entry
 * in fontawesome/advanced-options/metadata/icons.json
 */
 export interface IconEntry {
    name: string;
    changes: string[];
    ligatures?: any[];
    search: {
        terms: string[];
    };
    styles: IconStyle[];
    unicode: string;
    label: string;
}

export interface IconEntrySvg {
    last_modified: number;
    raw: string;
    viewBox: [string, string, string, string];
    width: number;
    height: number;
    path: string;
}

export const availablePrefixes = Object.keys(iconStylePrefix).map(key => iconStylePrefix[key as IconStyle]);
export const availableStyleNames = Object.values(IconStyle);
export const prefix = 'fa-';

export interface CategoryEntry {
    icons: string[];
    label: string;
}

export const vscode = acquireVsCodeApi();