
export const CITY_INITIAL_STATE: ICityResult = {
    items: [],
    loading: false,
    error: null,
  };

export interface ICity {
    id: string;
    name: string;
    thumbnail: string;
}

export interface ICityResult {
    items: ICity[];
    loading: boolean;
    error: Error;
}