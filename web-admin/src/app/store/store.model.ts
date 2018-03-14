import { IEntities, INIT_ENTITY_STATE } from "./entity/entity.model";
import { IUIState, INIT_UI_STATE } from "./ui/ui.model";
import { IDirties, INIT_DIRTY_STATE } from "./dirty/dirty.model";
import { INIT_UI_VIEWPOINT_STATE } from "./ui/viewPoint/viewPoint.model";

export enum STORE_KEY {
  ui = 'ui',
  entities = 'entities',
  dirties = 'dirties'
}

export const INIT_APP_STATE = {
  entities: INIT_ENTITY_STATE,
  dirties: INIT_DIRTY_STATE,
  ui: INIT_UI_STATE,
  error: {description: '',stack: ''},
  progress: {progressing: false}
}

export interface IError {
  description: string;
  stack?: string;
}

export interface IProgress {
  progressing: boolean;
}

export interface IAppState {
  entities: IEntities,
  dirties: IDirties,
  ui: IUIState,
  error: IError,
  progress: IProgress
}