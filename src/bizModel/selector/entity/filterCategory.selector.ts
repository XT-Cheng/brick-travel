import { NgRedux } from '@angular-redux/store';
import { asMutable } from 'seamless-immutable';

import { IAppState } from '../../../modules/store/store.model';
import { IFilterCategoryBiz } from '../../model/filterCategory.biz.model';
import { Observable } from 'rxjs/Observable';

export function getFilterCategories(store : NgRedux<IAppState>) : Observable<IFilterCategoryBiz[]> {
    return store.select<{ [id: string]: IFilterCategoryBiz }>(['entities', 'filterCategories'])
    .map(getFilterCategoriesInternal(store));
}

export function getFilterCategoriesInternal(store : NgRedux<IAppState>) {
    return (data : { [id : string] : IFilterCategoryBiz }) : Array<IFilterCategoryBiz> => {
        let ret = new Array<IFilterCategoryBiz>();
        let criteries = asMutable(store.getState().entities.filterCriteries,{deep: true});
        let categories = asMutable(data,{deep: true});
        Object.keys(categories).forEach(key => {
            let category = categories[key];
            category.criteries = category.criteries.map(id => criteries[id])
            ret.push(category);
        });
        
        return ret;
    }
}