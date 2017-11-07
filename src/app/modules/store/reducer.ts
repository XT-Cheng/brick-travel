import { combineReducers } from 'redux';
import { cityReducer } from './city/reducer';
import { IAppState } from './model';
import { viewPointReducer } from './viewPoint/reducer';

// Define the global store shape by combining our application's
// reducers together into a given structure.
export const rootReducer = 
  combineReducers<IAppState>({
    cities: cityReducer,
    viewPoints: viewPointReducer,
  });
