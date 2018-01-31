import { combineReducers } from 'redux';

import { cityReducer } from '../../../providers/city.service';
import { viewPointReducer } from '../../../providers/viewPoint.service';
import { travelAgendaReducer } from './travelAgenda/travelAgenda.reducer';
import { UIAction, UIActionTypeEnum } from './ui.action';
import { IUIState } from './ui.model';

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