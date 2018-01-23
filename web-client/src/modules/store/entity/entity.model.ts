import { ICity } from "./city/city.model";
import { IViewPoint, IViewPointComment } from "./viewPoint/viewPoint.model";
import { ITravelViewPoint, IDailyTrip, ITravelAgenda } from "./travelAgenda/travelAgenda.model";
import { IFilterCategory, IFilterCriteria } from "./filterCategory/filterCategory.model";

export enum EntityPersistentStatusEnum {
  NEW,
  SYNCED,
  DIRTY
}

export interface IPersistentStatus {
  persistentStatus: EntityPersistentStatusEnum
}

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

export interface IEntities {
  cities: { [_id : string] : ICity },
  viewPoints: { [_id : string] : IViewPoint },
  viewPointComments: { [_id : string] : IViewPointComment },
  users: { [_id : string] : IUser },
  travelViewPoints: { [_id : string] : ITravelViewPoint },
  dailyTrips: { [_id : string] : IDailyTrip },
  travelAgendas: { [_id : string] : ITravelAgenda },
  filterCategories: {[_id : string] : IFilterCategory},
  filterCriteries: {[_id : string] : IFilterCriteria}
}

export interface IUser {
  _id: string,
  name: string
}