import { Action } from 'redux';

import { ICityResult, CITY_INITIAL_STATE, ICity } from "./model";
import { CityActionType, CityAction } from "./action";

export function cityReducer(state: ICityResult = CITY_INITIAL_STATE, action: CityActionType): ICityResult {
    //const action = a as CityActionType;
    switch (action.type) {
      case CityAction.LOAD_CITIES_STARTED:
        return {
          ...state,
          items: [],
          loading: true,
          error: null,
        };
      case CityAction.LOAD_CITIES_SUCCEEDED:
        return {
          ...state,
          items: action.payload as ICity[],
          loading: false,
          error: null,
        };
      case CityAction.LOAD_CITIES_FAILED:
        return {
          ...state,
          items: [],
          loading: false,
          error: action.payload as Error,
        };
    }

    return state;
}
