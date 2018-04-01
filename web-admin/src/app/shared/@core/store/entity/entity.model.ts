import { ICity } from "./city/city.model";
import { IViewPoint, IViewPointComment } from "./viewPoint/viewPoint.model";
import { ITravelViewPoint, IDailyTrip, ITravelAgenda } from "./travelAgenda/travelAgenda.model";
import { IFilterCategory, IFilterCriteria } from "./filterCategory/filterCategory.model";
import { IUser } from "./user/user.model";

export enum STORE_ENTITIES_KEY {
  cities = 'cities',
  travelAgendas = 'travelAgendas',
  dailyTrips = 'dailyTrips',
  travelViewPoints = 'travelViewPoints',
  viewPoints = 'viewPoints',
  viewPointComments = 'viewPointComments',
  filterCategories = 'filterCategories',
  filterCriteries = 'filterCriteries',
  users = 'users'
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
  cities?: { [id : string] : ICity },
  viewPoints?: { [id : string] : IViewPoint },
  viewPointComments?: { [id : string] : IViewPointComment },
  users?: { [id : string] : IUser },
  travelViewPoints?: { [id : string] : ITravelViewPoint },
  dailyTrips?: { [id : string] : IDailyTrip },
  travelAgendas?: { [id : string] : ITravelAgenda },
  filterCategories?: {[id : string] : IFilterCategory},
  filterCriteries?: {[id : string] : IFilterCriteria}
}