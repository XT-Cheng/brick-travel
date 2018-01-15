export interface IFilterCriteria {
    _id: string,
    name: string,
    criteria: string
};

export interface IFilterCategory {
    _id: string,
    name: string,
    criteries: string[],
    filter: string,
    filterFunction: string
};
