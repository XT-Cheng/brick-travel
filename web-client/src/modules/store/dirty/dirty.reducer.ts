import * as Immutable from 'seamless-immutable';

import { EntityTypeEnum, getEntityKey } from '../entity/entity.action';
import { DirtyAction, DirtyActionTypeEnum, DirtyTypeEnum } from './dirty.action';
import { IDirties, INIT_DIRTY_STATE } from './dirty.model';

export function dirtyReducer(state: IDirties = INIT_DIRTY_STATE, action: DirtyAction): IDirties {
  if (action.payload && action.payload.dirtyId) {
    let newDirtyIds: Array<string>

    let key1 = getEntityKey(action.meta.entityType);
    let key2 = action.meta.dirtyType;

    switch (action.type) {
      case DirtyActionTypeEnum.ADD: {
        if (state[key1][DirtyTypeEnum.CREATED].find(id => id == action.payload.dirtyId))
          return state;
        state = Immutable(state).set(key1, clear(Immutable(state[key1]).asMutable(), action.payload.dirtyId));
        newDirtyIds = state[key1][key2].concat(action.payload.dirtyId);
        break;
      }
      case DirtyActionTypeEnum.REMOVE: {
        newDirtyIds = state[key1][key2].filter((id) => action.payload.dirtyId != id);
        break;
      }
      case DirtyActionTypeEnum.FLUSH: {
        newDirtyIds = [];
        break;
      }
    }
    state = Immutable(state).setIn([key1, key2], newDirtyIds);
  }
  return state;
};

function clear(state: { created: string[], updated: string[], deleted: string[] }, toBeClear: string) {
  state.created = state.created.filter((id) => toBeClear != id);
  state.updated = state.updated.filter((id) => toBeClear != id);
  state.deleted = state.deleted.filter((id) => toBeClear != id);

  return state;
}