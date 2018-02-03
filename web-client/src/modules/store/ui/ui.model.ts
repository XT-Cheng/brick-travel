import { IViewPointUI } from "./viewPoint/viewPoint.model";
import { ITravelAgendaUI } from "./travelAgenda/travelAgenda.model";
import { ICityUI } from "./city/city.model";

export enum STORE_UI_KEY {
  city = 'city',
  travelAgenda = 'travelAgenda',
  viewPoint = 'viewPoint'
}


export interface IUIState {
    city: ICityUI,
    viewPoint: IViewPointUI,
    travelAgenda: ITravelAgendaUI
  }