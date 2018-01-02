import { IEntities } from "./entity/entity.model";
import { IUIState } from "./ui/ui.model";

export interface IError {
  description: string;
  stack?: string;
}

export interface IProgress {
  progressing: boolean;
}

export interface IAppState {
  entities: IEntities,
  ui: IUIState,
  error: IError,
  progress: IProgress
}