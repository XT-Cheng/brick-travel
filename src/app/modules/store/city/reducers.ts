import { Action } from 'redux';

import { ICityResult } from "./models";
import { CityAction, CityActions } from "./actions";

const INITIAL_STATE: ICityResult = {
  items: [],
  loading: false,
  error: null,
};

export function cityReducer(state: ICityResult = INITIAL_STATE, a: Action): ICityResult {
    const action = a as CityAction;
    
    switch (action.type) {
      case CityActions.LOAD_CITIES_STARTED:
        return {
          ...state,
          items: [],
          loading: true,
          error: null,
        };
      case CityActions.LOAD_CITIES_SUCCEEDED:
        return {
          ...state,
          items: action.payload,
          loading: false,
          error: null,
        };
      case CityActions.LOAD_CITIES_FAILED:
        return {
          ...state,
          items: [],
          loading: false,
          error: action.error,
        };
    }

    return state;
}
