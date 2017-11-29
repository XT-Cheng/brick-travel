import { IViewPointUI } from "./viewPoint/viewPoint.model";
import { ITravelAgendaUI } from "./travelAgenda/travelAgenda.model";

export interface IUIState {
    viewMode: boolean,
    viewPoint: IViewPointUI,
    travelAgenda: ITravelAgendaUI
  }