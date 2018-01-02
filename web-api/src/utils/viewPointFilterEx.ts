import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
import { IFilterCriteriaBiz } from '../bizModel/model/filterCategory.biz.model';

export class ViewPointFilterEx {
    static filterByCategory(viewPoint : IViewPointBiz, criteria : IFilterCriteriaBiz) : boolean {
        return viewPoint.category.toString() == criteria.criteria
    }
} 