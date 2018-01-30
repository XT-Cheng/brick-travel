import * as Immutable from 'seamless-immutable'

import { INIT_UI_CITY_STATE, ICityUI } from './city.model';
import { UICityAction, UICityActionTypeEnum } from './city.action';

export function cityReducer(state = INIT_UI_CITY_STATE, action: UICityAction): ICityUI {
    switch (action.type) {
      case UICityActionTypeEnum.SELECT_CITY: {
        let nextState = Immutable(state).asMutable({ deep: true });
        nextState.selectedCityId = action.payload.selectedCityId;
  
        return nextState;
      }
    }
    return state;
  };