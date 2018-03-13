export enum STORE_UI_CITY_KEY {
  selectedCityId = 'selectedCityId',
  searchKey = 'searchKey'
}

export const INIT_UI_CITY_STATE = {
  [STORE_UI_CITY_KEY.selectedCityId]: '',
  [STORE_UI_CITY_KEY.searchKey]: ''
}

export interface ICityUI {
  searchKey: string,
  selectedCityId: string
}