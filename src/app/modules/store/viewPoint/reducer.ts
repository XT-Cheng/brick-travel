import { Action } from 'redux';

import { IViewPointResult, VIEWPOINT_INITIAL_STATE, IViewPoint } from "./model";
import { ViewPointActionType, ViewPointAction } from "./action";

export function viewPointReducer(state: IViewPointResult = VIEWPOINT_INITIAL_STATE, a: Action): IViewPointResult {
    const action = a as ViewPointActionType;
    
    switch (action.type) {
      case ViewPointAction.LOAD_VIEWPOINTS_STARTED:
        return {
          ...state,
          items: [],
          loading: true,
          error: null,
        };
      case ViewPointAction.LOAD_VIEWPOINTS_SUCCEEDED:
        return {
          ...state,
          items: action.payload as IViewPoint[],
          loading: false,
          error: null,
        };
      case ViewPointAction.LOAD_VIEWPOINTS_FAILED:
        return {
          ...state,
          items: [],
          loading: false,
          error: action.payload as Error,
        };
    }

    return state;
}
