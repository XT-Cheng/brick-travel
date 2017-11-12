import { ICity } from "./city/model";
import { IViewPoint, IViewPointComment } from "./viewPoint/model";
import { ITravelViewPoint, IDailyTrip, ITravelAgenda } from "./travelAgenda/model";

export const INIT_ENTITY_STATE = {
  cities: new Array<ICity>(),
  viewPoints: new Array<IViewPoint>(),
  viewPointComments: new Array<IViewPointComment>(),
  travelViewPoints: new Array<ITravelViewPoint>(),
  dailyTrips: new Array<IDailyTrip>(),
  travelAgendas: new Array<ITravelAgenda>(),
  users: new Array<IUser>()
}

export interface IError {
  description: string;
  stack?: string;
}

export interface IProgress {
  progressing: boolean;
}

export interface IEntities {
  cities: ICity[],
  viewPoints: IViewPoint[],
  viewPointComments: IViewPointComment[],
  users: IUser[],
  travelViewPoints: ITravelViewPoint[],
  dailyTrips: IDailyTrip[],
  travelAgendas: ITravelAgenda[]
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

export function shapeData(data : any) : IEntities {
  console.log(data.entities);
  let entities = {};
  Object.keys(data.entities).forEach(key => {
    entities[key] = Object.keys(data.entities[key]).map(id => data.entities[key][id]);
  });

  return Object.assign({},INIT_ENTITY_STATE,entities);
}
