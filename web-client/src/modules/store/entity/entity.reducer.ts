import { asMutable, isImmutable } from 'seamless-immutable';

import { EntityAction, EntityActionTypeEnum } from './entity.action';
import { IEntities, INIT_ENTITY_STATE } from './entity.model';

export function entityReducer(state: IEntities = INIT_ENTITY_STATE, action: EntityAction): IEntities {
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
      case EntityActionTypeEnum.UPDATE: {
        let nextState = asMutable(state); 

        Object.keys(action.payload.entities).forEach(key => {
          Object.keys(action.payload.entities[key]).forEach(id => {
            if (Object.keys(state[key]).find(toFind => id === toFind)){
              if (isImmutable(nextState[key]))
                nextState[key] = asMutable(nextState[key]);
              nextState[key][id] = action.payload.entities[key][id];
            }
          });
        });

        return nextState;
      }
      case EntityActionTypeEnum.INSERT: {
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
      case EntityActionTypeEnum.DELETE: {
        let nextState = asMutable(state); 

        Object.keys(action.payload.entities).forEach(key => {
          Object.keys(action.payload.entities[key]).forEach(id => {
            if (Object.keys(state[key]).find(toFind => id === toFind)){
              if (isImmutable(nextState[key]))
                nextState[key] = asMutable(nextState[key]);
              delete nextState[key][id];
            }
          });
        });

        return nextState;
      }
    }
  }
  
  return state;
};