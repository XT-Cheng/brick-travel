import * as Immutable from 'seamless-immutable';

import { EntityAction, EntityActionTypeEnum } from './entity.action';
import { IEntities, INIT_ENTITY_STATE } from './entity.model';

export function entityReducer(state: IEntities = INIT_ENTITY_STATE, action: EntityAction): IEntities {
  if (action.payload && action.payload.entities) {
    switch (action.type) {
      case EntityActionTypeEnum.LOAD:
      case EntityActionTypeEnum.INSERT:
      case EntityActionTypeEnum.UPDATE: {
        return Immutable(state).merge(action.payload.entities, { deep: true });
      }
      case EntityActionTypeEnum.DELETE: {
        Object.keys(action.payload.entities).forEach(key => {
          Object.keys(action.payload.entities[key]).forEach(id => {
            state = Immutable(state).set(key, Immutable(state[key]).without(id));
          })
        });
        return state;
      }
      case EntityActionTypeEnum.APPEND_COMMENTS: {
        let key = Object.keys(action.payload.entities.viewPoints)[0];
        let oldViewPoint = state['viewPoints'][key];
        let newViewPointcomments = oldViewPoint.comments.concat(Object.keys(action.payload.entities.viewPointComments));
        //Update ViewPoint
        state = Immutable(state).setIn(['viewPoints',key,'comments'],newViewPointcomments);
        //Update ViewPointComments
        let newViewPointComments = Immutable(state.viewPointComments).merge(action.payload.entities.viewPointComments);
        state = Immutable(state).set('viewPointComments',newViewPointComments);

        return state;
      }
    }
  }

  return state;
};