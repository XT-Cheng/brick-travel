import { ICity } from "./city/model";
import { IViewPoint, IViewPointComment } from "./viewPoint/model";

export interface IError {
  description: string;
  stack?: string;
}

export interface IProgress {
  progressing: boolean;
}

export interface IEntities {
  cities?: ICity[],
  viewPoints?: IViewPoint[],
  viewPointComments?: IViewPointComment[]
}

export interface IAppState {
  entities: IEntities,
  error: IError,
  progress: IProgress
}
