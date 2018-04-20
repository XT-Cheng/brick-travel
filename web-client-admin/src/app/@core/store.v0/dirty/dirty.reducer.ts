import * as Immutable from 'seamless-immutable';

import { getEntityKey } from '../entity/entity.action';
import { DirtyAction, DirtyActionPhaseEnum, DirtyActionTypeEnum, DirtyTypeEnum } from './dirty.action';
import { IDirties, INIT_DIRTY_STATE } from './dirty.model';

export function dirtyReducer(state: IDirties = INIT_DIRTY_STATE, action: DirtyAction): IDirties {
  if (action.payload) {
    let newDirtyIds: Array<string>;

    const key1 = getEntityKey(action.meta.entityType);
    const key2 = action.meta.dirtyType;

    const dirtyIds = state.dirtyIds;

    switch (action.type) {
      case DirtyActionTypeEnum.ADD: {
        if (dirtyIds[key1][DirtyTypeEnum.CREATED].find(id => id === action.payload.dirtyId)) {
          return state;
        }
        state = Immutable(state).setIn(['dirtyIds', key1], clear(Immutable(state.dirtyIds[key1]).asMutable(), action.payload.dirtyId));
        newDirtyIds = state.dirtyIds[key1][key2].concat(action.payload.dirtyId);
        break;
      }
      case DirtyActionTypeEnum.REMOVE: {
        newDirtyIds = state.dirtyIds[key1][key2].filter((id) => action.payload.dirtyId !== id);
        break;
      }
      case DirtyActionTypeEnum.FLUSH: {
        switch (action.meta.phaseType) {
          case DirtyActionPhaseEnum.START: {
            state = Immutable(state).set('syncing', true);
            state = Immutable(state).set('lastError', null);
            break;
          }
          case DirtyActionPhaseEnum.TRIGGER: {
            break;
          }
          case DirtyActionPhaseEnum.FINISHED: {
            state = Immutable(state).set('lastSynced', new Date());
            state = Immutable(state).set('syncing', false);
            break;
          }
          case DirtyActionPhaseEnum.FAIL: {
            state = Immutable(state).set('lastError', action.payload.error);
            break;
          }
        }
        break;
      }
    }

    if (newDirtyIds) {
      state = Immutable(state).setIn(['dirtyIds', key1, key2], newDirtyIds);
    }
  }
  return state;
}

function clear(state: { created: string[], updated: string[], deleted: string[] }, toBeClear: string) {
  state.created = state.created.filter((id) => toBeClear !== id);
  state.updated = state.updated.filter((id) => toBeClear !== id);
  state.deleted = state.deleted.filter((id) => toBeClear !== id);

  return state;
}
