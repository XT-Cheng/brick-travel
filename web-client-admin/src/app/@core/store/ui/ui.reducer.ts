import { combineReducers } from 'redux';

import { cityReducer } from './reducer/city.reducer';
import { IUIState } from './ui.model';

export const uiReducer =
    combineReducers<IUIState>({
        city: cityReducer
    });
