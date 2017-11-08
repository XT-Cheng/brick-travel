import { combineReducers } from 'redux';
import { IAppState, IEntities, IError, IProgress } from './model';
import { ICity } from './city/model';
import { GeneralAction } from './action';
import { IViewPoint } from './viewPoint/model';

// Define the global store shape by combining our application's
// reducers together into a given structure.
export const rootReducer =
  combineReducers<IAppState>({
    entities: entityReducer,
    progress: progressReducer,
    error: errorReducer
  });

export function progressReducer(state: IProgress = { progressing: false },
  action: GeneralAction): IProgress {
  if (action.meta)
    return {progressing: !!action.meta.progressing};
    
  return state;
};

export function entityReducer(state: IEntities = { cities: new Array<ICity>(), viewPoints: new Array<IViewPoint>()},
  action: GeneralAction): IEntities {
  if (action.payload && action.payload.entities)
    return { ...state, ...action.payload.entities };

  return state;
};

export function errorReducer(state: IError = { description: null },action: GeneralAction): IError {
  if (action.error && action.payload.error)
    return {  
            description: action.payload.error.message || 'Something bad happened', 
            stack: action.payload.error.stack
           };

  return state;
};