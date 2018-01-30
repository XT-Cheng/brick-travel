import * as Immutable from 'seamless-immutable';

import { UIViewPointAction, UIViewPointActionTypeEnum } from './viewPoint.action';
import { INIT_UI_VIEWPOINT_STATE, IViewPointUI } from './viewPoint.model';

export function viewPointReducer(state = INIT_UI_VIEWPOINT_STATE, action: UIViewPointAction): IViewPointUI {
  switch (action.type) {
    case UIViewPointActionTypeEnum.SEARCH_VIEWPOINT: {
      let nextState = Immutable(state).asMutable({ deep: true });
      nextState.searchKey = action.payload.searchKey;

      return nextState;
    }
    case UIViewPointActionTypeEnum.SELECT_VIEWPOINT: {
      let nextState = Immutable(state).asMutable({ deep: true });
      nextState.selectedViewPointId = action.payload.selectedViewPointId;

      return nextState;
    }
    case UIViewPointActionTypeEnum.SELECT_CRITERIA: {
      let nextState = <IViewPointUI>Immutable(state).asMutable({ deep: true });
      let select = action.payload.selectCriteria;

      nextState.filterCriteriaIds = nextState.filterCriteriaIds
        .filter(id => !select.unSelectedCriteriaIds.find(removed => removed === id));

      if (action.payload.selectCriteria.selectedCriteriaId)
        nextState.filterCriteriaIds.push(action.payload.selectCriteria.selectedCriteriaId);

      return nextState;
    }
  }
  return state;
};