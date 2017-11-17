import { ICity } from "./city/city.model";
import { IViewPoint, IViewPointComment } from "./viewPoint/viewPoint.model";
import { ITravelViewPoint, IDailyTrip, ITravelAgenda } from "./travelAgenda/travelAgenda.model";
import { IFilterCategory, IFilterCriteria } from "./filterCategory/filterCategory.model";

export const INIT_ENTITY_STATE = {
  cities: {},
  viewPoints: {},
  viewPointComments: {},
  travelViewPoints: {},
  dailyTrips: {},
  travelAgendas: {},
  users: {},
  filterCategories: {},
  filterCriteries: {}
}

export interface IError {
  description: string;
  stack?: string;
}

export interface IProgress {
  progressing: boolean;
}

export interface IEntities {
  cities: { [id : string] : ICity },
  viewPoints: { [id : string] : IViewPoint },
  viewPointComments: { [id : string] : IViewPointComment },
  users: { [id : string] : IUser },
  travelViewPoints: { [id : string] : ITravelViewPoint },
  dailyTrips: { [id : string] : IDailyTrip },
  travelAgendas: { [id : string] : ITravelAgenda },
  filterCategories: {[id : string] : IFilterCategory},
  filterCriteries: {[id : string] : IFilterCriteria}
}

export interface IUser {
  id: string,
  name: string
}

export interface IAppState {
  entities: IEntities,
  error: IError,
  progress: IProgress
}