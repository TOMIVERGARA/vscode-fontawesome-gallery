import * as categoryListV5 from '../data/fontawesome-5/metadata/categories.json';
import * as categoryListV6 from '../data/fontawesome-6/metadata/categories.json';
import type { CategoryEntry } from ".";

export interface CategoryCollection {[key: string]: CategoryEntry; }
export interface FullCategory { name: string, label: string, icons: string[] }

let categoryList: CategoryCollection;
export function getIconCategories(faVersion: string){
     if(faVersion === 'v6'){
         categoryList = categoryListV6 as CategoryCollection;
     }else if(faVersion === 'v5'){
         categoryList = categoryListV5 as CategoryCollection;
     }
     
     const categories: FullCategory[] = [];
     for(const category in categoryList){
         if(category === "default") return categories;
         const entry = categoryList[category]
         categories.push({
             name: category,
             label: entry.label,
             icons: entry.icons
         })
     }

     return categories;
}

export function getIconsByCategory(target: string){
    let categoryIcons: CategoryEntry = {
        icons: [],
        label: ''
    };
    for(const category in categoryList){
        if(category === target){
            categoryIcons = categoryList[category];
            return categoryIcons;
        }
    }
    return categoryIcons;
}