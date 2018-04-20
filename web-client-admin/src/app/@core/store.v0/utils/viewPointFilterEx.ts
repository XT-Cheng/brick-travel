import { IFilterCriteriaBiz } from '../bizModel/filterCategory.biz.model';
import { IViewPointBiz } from '../bizModel/viewPoint.biz.model';

export class ViewPointFilterEx {
    static filterByCategory(viewPoint: IViewPointBiz, criteria: IFilterCriteriaBiz): boolean {
        return viewPoint.category.toString() === criteria.criteria;
    }

    static filterByNeedTime(viewPoint: IViewPointBiz, criteria: IFilterCriteriaBiz): boolean {
        return viewPoint.timeNeeded === criteria.criteria;
    }
}
