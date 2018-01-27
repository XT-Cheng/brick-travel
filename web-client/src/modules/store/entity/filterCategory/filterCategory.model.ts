export interface IFilterCriteria {
    id: string,
    name: string,
    criteria: string
};

export interface IFilterCategory {
    id: string,
    name: string,
    criteries: string[],
    filter: string,
    filterFunction: string
};
