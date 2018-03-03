import { IViewPointUI } from "./viewPoint/viewPoint.model";
import { ITravelAgendaUI } from "./travelAgenda/travelAgenda.model";
import { ICityUI } from "./city/city.model";
import { IUserUI } from "./user/user.model";

export enum STORE_UI_KEY {
  city = 'city',
  travelAgenda = 'travelAgenda',
  viewPoint = 'viewPoint',
  user = 'user'
}

export interface IUIState {
    city: ICityUI,
    viewPoint: IViewPointUI,
    travelAgenda: ITravelAgendaUI,
    user: IUserUI
  }