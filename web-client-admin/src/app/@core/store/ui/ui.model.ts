import { ICityUI, INIT_UI_CITY_STATE } from './model/city.model';
import { INIT_UI_USER_STATE, IUserUI } from './model/user.model';
import { INIT_UI_VIEWPOINT_STATE, IViewPointUI } from './model/viewPoint.model';

export enum STORE_UI_KEY {
  city = 'city',
  viewPoint = 'viewPoint',
  user = 'user'
}

export enum STORE_UI_COMMON_KEY {
  selectedId = 'selectedId',
  searchKey = 'searchKey'
}

export const INIT_UI_STATE: IUIState = {
  city: INIT_UI_CITY_STATE,
  viewPoint: INIT_UI_VIEWPOINT_STATE,
  user: INIT_UI_USER_STATE
};

export interface IUIState {
  city: ICityUI;
  viewPoint: IViewPointUI;
  user: IUserUI;
}
