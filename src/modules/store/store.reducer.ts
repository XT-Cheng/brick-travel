import { FluxStandardAction } from 'flux-standard-action';
import { combineReducers } from 'redux-seamless-immutable';

import { entityReducer } from './entity/entity.reducer';
import { IActionMetaInfo, IActionPayload } from './store.action';
import { IAppState, IError, IProgress } from './store.model';

// Define the global store shape by combining our application's
// reducers together into a given structure.
export const rootReducer =
  combineReducers<IAppState>({
    entities: entityReducer,
    progress: progressReducer,
    error: errorReducer
  });

export function progressReducer(state: IProgress = { progressing: false },
  action: FluxStandardAction<IActionPayload,IActionMetaInfo>): IProgress {
  if (action.meta)
    return { progressing: !!action.meta.progressing };

  return state;
};

export function errorReducer(state: IError = { description: null },
  action: FluxStandardAction<IActionPayload,IActionMetaInfo>): IError {
  if (action.error && action.payload.error)
    return {
      description: action.payload.error.message || 'Something bad happened',
      stack: action.payload.error.stack
    };

  return state;
};