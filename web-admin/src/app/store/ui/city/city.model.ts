export enum STORE_UI_CITY_KEY {
  selectedCityId = 'selectedCityId'
}

export const INIT_UI_CITY_STATE = {
  [STORE_UI_CITY_KEY.selectedCityId]: ''
}

export interface ICityUI {
  selectedCityId: string
}