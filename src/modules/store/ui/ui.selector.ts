import { NgRedux } from '@angular-redux/store';
import { asMutable } from 'seamless-immutable';

import { IFilterCategory } from '../entity/filterCategory/filterCategory.model';
import { IAppState } from '../store.model';

export function getCurrentFilters(store : NgRedux<IAppState>) {
    return (data : string[]) : Array<IFilterCategory> => {
        let ret = new Array<IFilterCategory>();
       
        let criteries =  asMutable(store.getState().entities.filterCriteries,{deep: true});
        let categories = asMutable(store.getState().entities.filterCategories,{deep: true});

        Object.keys(categories).forEach(key => {
            let category = categories[key];
            category.criteries = category.criteries.map(id => criteries[id])
            
            category.criteries.forEach(criteria => {
                criteria.isChecked = !!data.find(id => id === criteria.id);
            });

            ret.push(category);
        });

        return ret;
    }
}