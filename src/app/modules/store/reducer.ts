import unionby from 'lodash/unionby'
import { combineReducers } from 'redux-seamless-immutable'
//import { combineReducers } from 'redux';
import { IAppState, IEntities, IError, IProgress } from './model';
import { ICity } from './city/model';
import { GeneralAction, EntityTypeEnum, EntityActionTypeEnum } from './action';
import { IViewPoint, IViewPointComment } from './viewPoint/model';

const INIT_ENTITY_STATE = {
  cities: new Array<ICity>(),
  viewPoints: new Array<IViewPoint>(),
  viewPointComments: new Array<IViewPointComment>()
}

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
        let nextState = Object.assign({}, state);
        
        Object.keys(action.payload.entities).forEach(key => {
          nextState[key] = unionby(state[key], action.payload.entities[key], 'id')
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