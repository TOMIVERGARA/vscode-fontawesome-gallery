import * as iconsList from '../data/fontawesome-5/metadata/fagIcons.json';
import * as searchIndex from '../data/fontawesome-5/metadata/searchIndexArray.json'
import Icon from './icon';
import type { IconEntry, CategoryEntry } from '.';
import { getIconsByCategory } from '../services/common';

export interface IconEntryCollection {[key: string]: IconEntry; }
export interface SearchIndexEntry {
    name: string;
    label: string;
    searchTerms: string[];
}

export default class IconList {
    public readonly iconEntries: IconEntryCollection;
    public readonly searchIndex = searchIndex.searchIndexArray as SearchIndexEntry[];
    icons: Icon[];
    //Search Engine
    searchReturnLimit: number = 10; // Maximum number of results to return
    globalIdx: number = 0;


    constructor(){
        this.iconEntries = iconsList as IconEntryCollection;
        this.icons = [];
    }

    private isIterable (type: any) {
      return type != null && typeof type[Symbol.iterator] === 'function'
    }

    private listFromEntry(icon: string){
        const formattedIconName = `fag_${icon.replace(/-/ig, '_')}`;
        console.log(formattedIconName)
        const entry: IconEntry = this.iconEntries[formattedIconName];
        if(this.isIterable(entry.styles)){
            for(const style of entry.styles){
                const iconObj = new Icon(entry.name, entry.label, style);
                this.icons.push(iconObj);
            }
        }
    }

    private search(filter: string){
        const results: SearchIndexEntry[] = this.searchIndex.filter(icon => {
            for(const searchTerm of icon.searchTerms){
                if(searchTerm.match(`^${filter}$`)){
                  return true;
                }else if(icon.label.toLowerCase().match(`^${filter}.*$`)){
                  return true;
                }
                //Old Filter method
                //return searchTerm.match(`^${filter}.*$`) || icon.label.toLowerCase().match(`^${filter}.*$`);
            }
        })
        return results;
    }

    public generateList(category: string){
        this.icons = [];
        if(category === "all"){
            //Old generation method.
            // for(const icon in this.iconEntries){
            //     if (counter > 92) return this.icons;
            //     this.listFromEntry(icon);
            //     counter++;
            // }
            for (let i = 0; i < 100; i++) {
                this.globalIdx = i;
                const iconFromIndex = this.searchIndex[i];
                this.listFromEntry(iconFromIndex.name);
            }
            return this.icons
        }else{
           const iconsByCategory: CategoryEntry = getIconsByCategory(category);
           for(const icon of iconsByCategory.icons){
                this.listFromEntry(icon)
           }
           return this.icons
        }
    }

    public loadMoreIcons(){
        const startPoint: number = this.globalIdx + 1;
        for (let i = startPoint; i < startPoint + 100; i++) {
            this.globalIdx = i;
            const iconFromIndex = this.searchIndex[i];
            this.listFromEntry(iconFromIndex.name);
        }
        return this.icons
    }

    public filterIcons(filter: string){
        this.icons = [];
        const matches: SearchIndexEntry[] = this.search(filter);
        for(const icon of matches){
             this.listFromEntry(icon.name);
        }
        return this.icons;
    }

    public getTotal(){
        return this.searchIndex.length;
    }
}