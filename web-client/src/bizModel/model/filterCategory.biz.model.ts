export interface IFilterCriteriaBiz {
    _id: string,
    name: string,
    criteria: string,
    isChecked: boolean
};

export interface IFilterCategoryBiz {
    _id: string,
    name: string,
    criteries: IFilterCriteriaBiz[],
    filter: string,
    filterFunction: string
};
