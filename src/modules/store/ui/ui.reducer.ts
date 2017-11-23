import { asMutable } from 'seamless-immutable';

import { UIAction, UIActionTypeEnum } from './ui.action';
import { INIT_UI_STATE, IUIState } from './ui.model';

export function uiReducer(state: IUIState = INIT_UI_STATE, action: UIAction): IUIState {
  switch (action.type) {
    case UIActionTypeEnum.SEARCH_VIEWPOINT: {
      let nextState = asMutable(state, { deep: true });
      nextState.viewPoint.searchKey = action.payload.searchKey;

      return nextState;
    }
    case UIActionTypeEnum.SELECT_CRITERIA: {
      let nextState = <IUIState>asMutable(state, { deep: true });
      let select = action.payload.selectCriteria;
      let filters = nextState.viewPoint.filters;

      nextState.viewPoint.filters = nextState.viewPoint.filters
        .filter(id => !select.unSelectedCriteriaIds.find(removed => removed === id));

      if (action.payload.selectCriteria.selectedCriteriaId)
        nextState.viewPoint.filters.push(action.payload.selectCriteria.selectedCriteriaId);

      return nextState;
    }
  }
  return state;
};