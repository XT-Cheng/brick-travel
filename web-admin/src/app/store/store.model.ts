import { IEntities } from "./entity/entity.model";
import { IUIState } from "./ui/ui.model";
import { IDirties } from "./dirty/dirty.model";

export enum STORE_KEY {
  ui = 'ui',
  entities = 'entities',
  dirties = 'dirties'
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