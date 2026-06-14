import { IconStyle, iconStylePrefix, iconStyleClassV6, prefix } from ".";
import type { SvgData } from ".";

export default class Icon {
  /** Short style prefix: fab, far, fas */
  public readonly style: string;
  /** Style name: brands, regular, solid */
  public readonly styleName: string;
  public readonly name: string;
  public readonly unicode: string;
  public readonly label: string;
  public readonly prefix: string;
  /** All styles available for this icon (e.g. ["solid", "regular"]) */
  public readonly allStyles: string[];
  /** v5 class string: "fas fa-heart" */
  public readonly iconCode: string;
  /** v6/v7 class string: "fa-solid fa-heart" */
  public readonly iconCodeV6: string;
  /** SVG path data for this style (v6/v7 only) */
  public readonly svgPath?: string;
  public readonly svgWidth?: number;
  public readonly svgHeight?: number;

  constructor(
    name: string,
    unicode: string,
    label: string,
    style: string,
    svg?: SvgData,
    allStyles?: string[]
  ) {
    this.name = name;
    this.unicode = unicode;
    this.label = label;
    this.styleName = style;
    this.style = iconStylePrefix[style as IconStyle] ?? "fas";
    this.prefix = prefix;
    this.allStyles = allStyles ?? [style];
    this.iconCode = `${this.style} ${prefix}${name}`;
    this.iconCodeV6 = `${iconStyleClassV6[style as IconStyle] ?? "fa-solid"} ${prefix}${name}`;
    if (svg) {
      this.svgPath = svg.path;
      this.svgWidth = svg.width;
      this.svgHeight = svg.height;
    }
  }
}
