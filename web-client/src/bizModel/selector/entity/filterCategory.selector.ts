import { NgRedux } from '@angular-redux/store';
import { denormalize } from 'normalizr';
import { Observable } from 'rxjs/Observable';
import * as Immutable from 'seamless-immutable';

import { filterCategory } from '../../../modules/store/entity/entity.schema';
import { IFilterCategory } from '../../../modules/store/entity/filterCategory/filterCategory.model';
import { IAppState } from '../../../modules/store/store.model';
import { IFilterCategoryBiz } from '../../model/filterCategory.biz.model';

export function getFilterCategories(store : NgRedux<IAppState>) : Observable<IFilterCategoryBiz[]> {
    return store.select<{ [id: string]: IFilterCategory }>(['entities', 'filterCategories'])
    .map(getFilterCategoriesInternal(store));
}

export function getFilterCategoriesInternal(store : NgRedux<IAppState>) {
    return (data : { [id : string] : IFilterCategory }) : Array<IFilterCategoryBiz> => {
        return denormalize(Object.keys(data),[ filterCategory ],Immutable(store.getState().entities).asMutable({deep: true}));
    }
}