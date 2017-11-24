import { IViewPointUI } from "./viewPoint/viewPoint.model";
import { ITravelAgendaUI } from "./travelAgenda/travelAgenda.model";

export interface IUIState {
    viewPoint: IViewPointUI,
    travelAgenda: ITravelAgendaUI
  }