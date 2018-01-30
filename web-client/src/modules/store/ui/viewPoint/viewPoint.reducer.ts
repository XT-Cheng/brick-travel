import * as Immutable from 'seamless-immutable';

import { UIViewPointAction, UIViewPointActionTypeEnum } from './viewPoint.action';
import { INIT_UI_VIEWPOINT_STATE, IViewPointUI } from './viewPoint.model';

export function viewPointReducer(state = INIT_UI_VIEWPOINT_STATE, action: UIViewPointAction): IViewPointUI {
  switch (action.type) {
    case UIViewPointActionTypeEnum.SEARCH_VIEWPOINT: {
      return Immutable(state).set('searchKey', action.payload.searchKey);
    }
    case UIViewPointActionTypeEnum.SELECT_VIEWPOINT: {
      return Immutable(state).set('selectedViewPointId', action.payload.selectedViewPointId);
    }
    case UIViewPointActionTypeEnum.SELECT_CRITERIA: {

      state = Immutable(state).set('selectedViewPointId', action.payload.selectedViewPointId);

      let select = action.payload.selectCriteria;

      if (select) {
        let filterCriteriaIds = state.filterCriteriaIds
          .filter(id => !select.unSelectedCriteriaIds.find(removed => removed === id));

        if (action.payload.selectCriteria.selectedCriteriaId)
          filterCriteriaIds = filterCriteriaIds.concat(action.payload.selectCriteria.selectedCriteriaId);

        return Immutable(state).set('filterCriteriaIds', filterCriteriaIds);
      }
    }
  }
  return state;
};