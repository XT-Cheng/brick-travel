import { IFilterCategory, IFilterCriteria } from '../../entity/model/filterCategory.model';
import { IBiz } from '../biz.model';

export interface IFilterCriteriaBiz extends IBiz {
    name: string;
    criteria: string;
    isChecked: boolean;
}

export interface IFilterCategoryBiz extends IBiz {
    name: string;
    criteries: IFilterCriteriaBiz[];
    filterFunction: string;
}

export function translateFilterCriteriaFromBiz(criteria: IFilterCriteriaBiz): IFilterCriteria {
    return {
        id: criteria.id,
        name: criteria.name,
        criteria: criteria.criteria
    };
}

export function translateFilterCategoryFromBiz(category: IFilterCategoryBiz): IFilterCategory {
    return {
        id: category.id,
        name: category.name,
        filterFunction: category.filterFunction,
        criteries: category.criteries.map(c => c.id)
    };
}

