import { ICityResult } from "./city/model";
export interface IMetaInfo {
  pagination: IPagination;
}

export interface IPagination {
  page: number;
  limit: number;
}

export interface IError {
  description: string;
  stack?: string;
}

export interface IAppState {
  cities: ICityResult;
}
