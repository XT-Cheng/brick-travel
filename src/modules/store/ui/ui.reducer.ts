import { asMutable } from 'seamless-immutable';

import { UIAction, UIActionTypeEnum } from "./ui.action";
import { IUIState, INIT_UI_STATE } from "./ui.model";

export function uiReducer(state: IUIState = INIT_UI_STATE, action: UIAction): IUIState {
  switch (action.type) {
    case UIActionTypeEnum.SEARCH: {
      let nextState = asMutable(state, {deep: true});
      nextState.viewPoint.searchKey = action.payload.searchKey;

      return nextState;
    }
  }
    return state;
  };