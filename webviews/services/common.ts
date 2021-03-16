import * as categoryList from '../data/fontawesome-5/metadata/categories.json';
import type { CategoryEntry } from ".";

export interface CategoryCollection {[key: string]: CategoryEntry; }
export interface FullCategory { name: string, label: string, icons: string[] }

export function getIconCategories(){
     const categories: FullCategory[] = [];
     const CategoryList = categoryList as CategoryCollection
     for(const category in categoryList){
         if(category === "default") return categories;
         const entry = CategoryList[category]
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
    const CategoryList = categoryList as CategoryCollection
    for(const category in categoryList){
        if(category === target){
            categoryIcons = CategoryList[category];
            return categoryIcons;
        }
    }
    return categoryIcons;
}