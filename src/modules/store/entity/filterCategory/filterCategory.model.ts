export interface IFilterCriteria {
    id: string,
    name: string,
    criteria: string,
    isChecked: boolean
};

export interface IFilterCategory {
    id: string
    name: string,
    criteries: IFilterCriteria[],
    filter: string
};
