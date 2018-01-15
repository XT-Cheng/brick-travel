import { ViewPointFilterEx } from '../../../utils/viewPointFilterEx';
import { getViewPoints } from '../entity/viewPoint.selector';
import { IViewPointBiz } from '../../model/viewPoint.biz.model';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../modules/store/store.model';
import { IFilterCategoryBiz } from '../../model/filterCategory.biz.model';
import { getFilterCategories } from '../entity/filterCategory.selector';

export function getCurrentFilters(store: NgRedux<IAppState>): Observable<IFilterCategoryBiz[]> {
    return getFilterCriteriaIds(store).combineLatest(getFilterCategories(store), (v1, v2) => {
        return buildCurrentFilterCategories(v1, v2);
    });
}

function getFilterCriteriaIds(store: NgRedux<IAppState>): Observable<string[]> {
    return store.select<string[]>(['ui', 'viewPoint', 'filterCriteriaIds'])
}

function buildCurrentFilterCategories(checkIds: string[], categories: IFilterCategoryBiz[]) {
    categories.forEach(category => {
        category.criteries.forEach(criteria => {
            criteria.isChecked = !!checkIds.find(_id => _id === criteria._id);
        })
    });

    return categories;
}

export function getFilteredViewPoints(store: NgRedux<IAppState>): Observable<IViewPointBiz[]> {
    return getCurrentFilters(store).combineLatest(getViewPoints(store), (v1, v2) => {
        return getFilteredViewPointsInternal(v1, v2);
    });
}

function getFilteredViewPointsInternal(filterCategories: IFilterCategoryBiz[], viewPoints: IViewPointBiz[]): IViewPointBiz[] {
    return viewPoints.filter(viewPoint => {
        return filterCategories.every(category => {
            return category.criteries.every(criteria => {
                if (criteria.isChecked && ViewPointFilterEx[category.filterFunction])
                    return ViewPointFilterEx[category.filterFunction](viewPoint, criteria);
                return true;
            })
        })
    });
}
