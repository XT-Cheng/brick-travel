export interface IFilterCriteriaBiz {
    id: string;
    name: string;
    criteria: string;
    isChecked: boolean;
}

export interface IFilterCategoryBiz {
    id: string;
    name: string;
    criteries: IFilterCriteriaBiz[];
    filter: string;
    filterFunction: string;
}
