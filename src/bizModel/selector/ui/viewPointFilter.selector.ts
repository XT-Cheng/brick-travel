import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../modules/store/store.model';
import { IFilterCategoryBiz } from '../../model/filterCategory.biz.model';
import { getFilterCategories } from '../entity/filterCategory.selector';

export function getCurrentFilters(store: NgRedux<IAppState>): Observable<IFilterCategoryBiz[]> {
    return getFilterIds(store).combineLatest(getFilterCategories(store), (v1, v2) => {
        return buildCurrentFilters(v1, v2);
    });
}

function getFilterIds(store: NgRedux<IAppState>): Observable<string[]> {
    return store.select<string[]>(['ui', 'viewPoint', 'filters'])
}

function buildCurrentFilters(checkIds: string[], categories: IFilterCategoryBiz[]) {
    categories.forEach(category => {
        category.criteries.forEach(criteria => {
            criteria.isChecked = !!checkIds.find(id => id === criteria.id);
        })
    });

    return categories;
}