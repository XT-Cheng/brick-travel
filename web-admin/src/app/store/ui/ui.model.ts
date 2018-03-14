import { ICityUI, INIT_UI_CITY_STATE } from './city/city.model';
import { INIT_UI_TRAVELAGENDA_STATE, ITravelAgendaUI } from './travelAgenda/travelAgenda.model';
import { INIT_UI_USER_STATE, IUserUI } from './user/user.model';
import { INIT_UI_VIEWPOINT_STATE, IViewPointUI } from './viewPoint/viewPoint.model';

export enum STORE_UI_KEY {
  city = 'city',
  travelAgenda = 'travelAgenda',
  viewPoint = 'viewPoint',
  user = 'user'
}

export const INIT_UI_STATE = {
  city: INIT_UI_CITY_STATE,
  viewPoint: INIT_UI_VIEWPOINT_STATE,
  travelAgenda: INIT_UI_TRAVELAGENDA_STATE,
  user: INIT_UI_USER_STATE
}

export interface IUIState {
    city: ICityUI,
    viewPoint: IViewPointUI,
    travelAgenda: ITravelAgendaUI,
    user: IUserUI
  }