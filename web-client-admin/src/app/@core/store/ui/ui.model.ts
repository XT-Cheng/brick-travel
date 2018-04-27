import { ICityUI, INIT_UI_CITY_STATE } from './model/city.model';

export enum STORE_UI_KEY {
  city = 'city',
}

export enum STORE_UI_COMMON_KEY {
  selectedId = 'selectedId',
  searchKey = 'searchKey'
}


export const INIT_UI_STATE = {
  city: INIT_UI_CITY_STATE,
};

export interface IUIState {
  city: ICityUI;
}
