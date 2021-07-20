import { IconStyle, iconStylePrefix, prefix } from ".";

interface IconItem {
  iconName: String;
  iconLabel: String;
  iconCode: String;
  styleName: String;
}

export default class Icon {
  /** Short style of the icon, e.g. fab, far */
  public readonly style: string;
  /** Style name of the icon, e.g. brands, regular */
  public readonly name: string;
  public readonly unicode: string;
  public readonly label: string;
  public readonly styleName: string;
  public readonly prefix: string;
  public readonly iconCode: string;

  constructor(name: string, unicode: string, label: string, style: IconStyle) {
    this.name = name;
    this.unicode = unicode;
    this.label = label;
    this.styleName = style;
    this.style = iconStylePrefix[style];
    this.prefix = prefix;
    this.iconCode = `${this.style} ${this.prefix}${this.name}`;
  }
}
