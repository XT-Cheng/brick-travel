import * as Immutable from 'seamless-immutable';

import { EntityAction, EntityActionTypeEnum } from './entity.action';
import { IEntities, INIT_ENTITY_STATE } from './entity.model';

export function entityReducer(state: IEntities = INIT_ENTITY_STATE, action: EntityAction): IEntities {
  if (action.payload && action.payload.entities) {
    switch (action.type) {
      case EntityActionTypeEnum.LOAD: {
        Object.keys(action.payload.entities).forEach(key => {
          state = Immutable(state).set(key, (<any>Immutable(state[key])).replace(action.payload.entities[key], { deep: true }));
        });
        return state;
      }
      case EntityActionTypeEnum.INSERT:
      case EntityActionTypeEnum.UPDATE: {
        return Immutable(state).merge(action.payload.entities, { deep: true });
      }
      case EntityActionTypeEnum.DELETE: {
        Object.keys(action.payload.entities).forEach(key => {
          Object.keys(action.payload.entities[key]).forEach(id => {
            state = Immutable(state).set(key, Immutable(state[key]).without(id));
          });
        });
        return state;
      }
    }
  }

  return state;
}
