import { IBiz } from '../biz.model';
import { IViewPointBiz } from './viewPoint.biz.model';

export interface ITransportationCategoryBiz extends IBiz {
    name: string;
    isDefault: boolean;
}

export interface ITravelAgendaBiz extends IBiz {
    name: string;
    user: string;
    cover: string;
    dailyTrips: IDailyTripBiz[];
}

export interface IDailyTripBiz extends IBiz {
    travelViewPoints: ITravelViewPointBiz[];
    lastViewPoint: ITravelViewPointBiz;
    travelAgenda: ITravelAgendaBiz;
}

export interface ITravelViewPointBiz extends IBiz {
    viewPoint: IViewPointBiz;
    distanceToNext: number;
    dailyTrip: IDailyTripBiz;
    transportationToNext: ITransportationCategoryBiz;
}
