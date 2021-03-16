import { iconsList } from '../data/fontawesome-5/metadata/icons'
import Icon from './icon';
import type { IconEntry, CategoryEntry } from '.';
import { getIconsByCategory } from '../services/common';

export interface IconEntryCollection {[key: string]: IconEntry; }

export default class IconList {
    public readonly iconEntries: IconEntryCollection;
    icons: Icon[];

    constructor(){
        this.iconEntries = iconsList as IconEntryCollection;
        this.icons = [];
    }

    private isIterable (type: any) {
      return type != null && typeof type[Symbol.iterator] === 'function'
    }

    public generateList(category: string){
        this.icons = [];
        if(category === "all"){
            let counter: number = 0;
            for(const icon in this.iconEntries){
                if (counter > 99) return this.icons;
                const entry: IconEntry = this.iconEntries[icon];

                if(this.isIterable(entry.styles)){
                    for(const style of entry.styles){
                        const iconObj = new Icon(icon, entry.label, style);
                        this.icons.push(iconObj);
                    }
                }
                counter++;
            }
        }else{
           const iconsByCategory: CategoryEntry = getIconsByCategory(category);
           for(const icon of iconsByCategory.icons){
                const entry: IconEntry = this.iconEntries[icon];
                if(this.isIterable(entry.styles)){
                    for(const style of entry.styles){
                        const iconObj = new Icon(icon, entry.label, style);
                        this.icons.push(iconObj);
                    }
                }
           }
           return this.icons
        }
    }
}