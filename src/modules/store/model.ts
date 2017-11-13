import { ICity } from "./city/model";
import { IViewPoint, IViewPointComment } from "./viewPoint/model";
import { ITravelViewPoint, IDailyTrip, ITravelAgenda } from "./travelAgenda/model";

export const INIT_ENTITY_STATE = {
  cities: {},
  viewPoints: {},
  viewPointComments: {},
  travelViewPoints: {},
  dailyTrips: {},
  travelAgendas: {},
  users: {},
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