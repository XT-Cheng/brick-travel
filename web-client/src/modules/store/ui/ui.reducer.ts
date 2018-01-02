import { combineReducers } from "redux";
import { viewPointReducer } from "./viewPoint/viewPoint.reducer";
import { IUIState } from "./ui.model";
import { travelAgendaReducer } from "./travelAgenda/travelAgenda.reducer";
import { UIAction, UIActionTypeEnum } from "./ui.action";
import { cityReducer } from "./city/city.reducer";

export const uiReducer =
    combineReducers<IUIState>({
        viewPoint: viewPointReducer,
        travelAgenda: travelAgendaReducer,
        viewMode: viewModeReducer,
        city: cityReducer,
    });

export function viewModeReducer(state: boolean = false, action: UIAction): boolean {
    if (action.type === UIActionTypeEnum.SET_VIEWMODE)
        return action.payload.viewMode;

    return state;
};