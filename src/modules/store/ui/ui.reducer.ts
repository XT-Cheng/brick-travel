import { combineReducers } from "redux";
import { viewPointReducer } from "./viewPoint/viewPoint.reducer";
import { IUIState } from "./ui.model";
import { travelAgendaReducer } from "./travelAgenda/travelAgenda.reducer";

export const uiReducer =
    combineReducers<IUIState>({
        viewPoint: viewPointReducer,
        travelAgenda: travelAgendaReducer
    });