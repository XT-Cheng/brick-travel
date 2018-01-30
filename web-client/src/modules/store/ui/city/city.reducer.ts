import * as Immutable from 'seamless-immutable'

import { INIT_UI_CITY_STATE, ICityUI } from './city.model';
import { UICityAction, UICityActionTypeEnum } from './city.action';

export function cityReducer(state = INIT_UI_CITY_STATE, action: UICityAction): ICityUI {
    switch (action.type) {
      case UICityActionTypeEnum.SELECT_CITY: {
        return Immutable(state).set('selectedCityId',action.payload.selectedCityId);
      }
    }
    return state;
  };