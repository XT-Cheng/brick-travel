import { IDailyTrip, ITransportationCategory, ITravelAgenda, ITravelViewPoint } from '../../entity/model/travelAgenda.model';
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
    lastViewPoint: string;
    travelAgenda: ITravelAgendaBiz;
}

export interface ITravelViewPointBiz extends IBiz {
    viewPoint: IViewPointBiz;
    distanceToNext: number;
    dailyTrip: IDailyTripBiz;
    transportationToNext: ITransportationCategoryBiz;
}

export function translateDailyTripFromBiz(dailyTrip: IDailyTripBiz): IDailyTrip {
    return {
        id: dailyTrip.id,
        travelAgenda: dailyTrip.travelAgenda.id,
        travelViewPoints: dailyTrip.travelViewPoints.map(tvp => tvp.id)
    };
}

export function translateTransportationCategoryFromBiz(transportationCategory: ITransportationCategoryBiz): ITransportationCategory {
    return {
        id: transportationCategory.id,
        name: transportationCategory.name,
        isDefault: transportationCategory.isDefault
    };
}

export function translateTravelViewPointFromBiz(travelViewPoint: ITravelViewPointBiz): ITravelViewPoint {
    return {
        id: travelViewPoint.id,
        viewPoint: travelViewPoint.viewPoint.id,
        dailyTrip: travelViewPoint.dailyTrip.id,
        transportationToNext: travelViewPoint.transportationToNext.id
    };
}

export function translateTravelAgendaFromBiz(travelAgenda: ITravelAgendaBiz): ITravelAgenda {
    return {
        id: travelAgenda.id,
        name: travelAgenda.name,
        user: travelAgenda.user,
        cover: travelAgenda.cover,
        dailyTrips: travelAgenda.dailyTrips.map(dt => dt.id)
    };
}
