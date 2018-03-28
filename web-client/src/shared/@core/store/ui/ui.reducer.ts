import { combineReducers } from 'redux';

import { cityReducer } from '../providers/city.service';
import { viewPointReducer } from '../providers/viewPoint.service';
import { IUIState } from './ui.model';
import { travelAgendaReducer } from '../providers/travelAgenda.service';
import { userReducer } from '../providers/user.service';

export const uiReducer =
    combineReducers<IUIState>({
        viewPoint: viewPointReducer,
        travelAgenda: travelAgendaReducer,
        city: cityReducer,
        user : userReducer
    });