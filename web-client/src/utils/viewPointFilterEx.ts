import { IViewPointBiz } from '../modules/store/bizModel/model/viewPoint.biz.model';
import { IFilterCriteriaBiz } from '../modules/store/bizModel/model/filterCategory.biz.model';

export class ViewPointFilterEx {
    static filterByCategory(viewPoint : IViewPointBiz, criteria : IFilterCriteriaBiz) : boolean {
        return viewPoint.category.toString() == criteria.criteria
    }

    static filterByNeedTime(viewPoint : IViewPointBiz, criteria : IFilterCriteriaBiz) : boolean {
        return viewPoint.timeNeeded == criteria.criteria
    }
} 