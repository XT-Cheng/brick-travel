import { asMutable,isImmutable } from 'seamless-immutable';
import { combineReducers } from 'redux-seamless-immutable'
import { IAppState, IEntities, IError, IProgress, INIT_ENTITY_STATE } from './model';
import { GeneralAction, EntityActionTypeEnum } from './action';

// Define the global store shape by combining our application's
// reducers together into a given structure.
export const rootReducer =
  combineReducers<IAppState>({
    entities: entityReducer,
    progress: progressReducer,
    error: errorReducer
  });

export function entityReducer(state: IEntities = INIT_ENTITY_STATE, action: GeneralAction): IEntities {
  if (action.payload && action.payload.entities) {
    switch (action.type) {
      case EntityActionTypeEnum.LOAD: {
        let nextState = asMutable(state); 

        Object.keys(action.payload.entities).forEach(key => {
          Object.keys(action.payload.entities[key]).forEach(id => {
            if (!Object.keys(state[key]).find(toFind => id === toFind)){
              if (isImmutable(nextState[key]))
                nextState[key] = asMutable(nextState[key]);
              nextState[key][id] = action.payload.entities[key][id];
            }
          });
        });

        return nextState;
      }
    }
  }
  
  return state;
};

export function progressReducer(state: IProgress = { progressing: false },
  action: GeneralAction): IProgress {
  if (action.meta)
    return { progressing: !!action.meta.progressing };

  return state;
};

export function errorReducer(state: IError = { description: null }, action: GeneralAction): IError {
  if (action.error && action.payload.error)
    return {
      description: action.payload.error.message || 'Something bad happened',
      stack: action.payload.error.stack
    };

  return state;
};