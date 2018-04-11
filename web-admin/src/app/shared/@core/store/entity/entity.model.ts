import { ICity } from './city/city.model';
import { IFilterCategory, IFilterCriteria } from './filterCategory/filterCategory.model';
import { IDailyTrip, ITravelAgenda, ITravelViewPoint, ITransportationCategory } from './travelAgenda/travelAgenda.model';
import { IUser } from './user/user.model';
import { IViewPoint, IViewPointCategory, IViewPointComment } from './viewPoint/viewPoint.model';

export enum STORE_ENTITIES_KEY {
  cities = 'cities',
  travelAgendas = 'travelAgendas',
  dailyTrips = 'dailyTrips',
  travelViewPoints = 'travelViewPoints',
  viewPoints = 'viewPoints',
  viewPointComments = 'viewPointComments',
  filterCategories = 'filterCategories',
  filterCriteries = 'filterCriteries',
  users = 'users',
  viewPointCatgories = 'viewPointCatgories',
  transportationCatgories = 'transportationCatgories'
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
  filterCriteries: {},
  viewPointCatgories: {},
  transportationCatgories: {}
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
  filterCriteries?: {[id : string] : IFilterCriteria},
  viewPointCatgories?: {[id : string] : IViewPointCategory},
  transportationCatgories?: {[id : string] : ITransportationCategory}
}