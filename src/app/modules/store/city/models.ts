export interface ICity {
    id: string;
    name: string;
    thumbnail: string;
}

export interface ICityResult {
    items: ICity[];
    loading: boolean;
    error: any;
}