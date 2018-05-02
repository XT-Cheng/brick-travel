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
