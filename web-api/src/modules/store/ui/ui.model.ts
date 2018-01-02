import { IViewPointUI } from "./viewPoint/viewPoint.model";
import { ITravelAgendaUI } from "./travelAgenda/travelAgenda.model";
import { ICityUI } from "./city/city.model";

export interface IUIState {
    viewMode: boolean,
    city: ICityUI,
    viewPoint: IViewPointUI,
    travelAgenda: ITravelAgendaUI
  }