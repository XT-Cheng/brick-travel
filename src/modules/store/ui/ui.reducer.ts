import { combineReducers } from "redux";
import { viewPointReducer } from "./viewPoint/viewPoint.reducer";
import { IUIState } from "./ui.model";

export const uiReducer =
    combineReducers<IUIState>({
        viewPoint: viewPointReducer
    });