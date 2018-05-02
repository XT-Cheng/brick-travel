import { FluxStandardAction } from 'flux-standard-action';
import { combineReducers } from 'redux-seamless-immutable';

import { dirtyReducer } from './dirty/dirty.reducer';
import { entityReducer } from './entity/entity.reducer';
import { IActionMetaInfo, IActionPayload } from './store.action';
import { IError, IProgress } from './store.model';
import { uiReducer } from './ui/ui.reducer';

// Define the global store shape by combining our application's
// reducers together into a given structure.
export const rootReducer =
  combineReducers({
    entities: entityReducer,
    progress: progressReducer,
    ui: uiReducer,
    error: errorReducer,
    dirties: dirtyReducer
  });

export function progressReducer(state: IProgress = { progressing: false },
  action: FluxStandardAction<IActionPayload, IActionMetaInfo>): IProgress {
  if (action.meta) {
    return { progressing: !!action.meta.progressing };
  }

  return state;
}

export function errorReducer(state: IError = null,
  action: FluxStandardAction<IActionPayload, IActionMetaInfo>): IError {
  if (action.error && action.payload.error) {
    return {
      network: (action.payload.error.error instanceof ErrorEvent),
      description: (action.payload.error.error instanceof ErrorEvent) ? action.payload.error.error.message : action.payload.error.error,
      stack: ''
    };
  }

  return null;
}
