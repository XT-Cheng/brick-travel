import {
    IDailyTrip,
    ITravelAgenda,
    TransportationCategory,
    ITravelViewPoint,
} from '../../modules/store/entity/travelAgenda/travelAgenda.model';
import { IViewPointBiz } from './viewPoint.biz.model';

export interface ITravelAgendaBiz {
    id: string,
    name: string,
    user: string,
    cover: string,
    dailyTrips: IDailyTripBiz[]
};

export interface IDailyTripBiz {
    id: string,
    travelViewPoints: ITravelViewPointBiz[],
    lastViewPoint: string
}

export interface ITravelViewPointBiz {
    id: string,
    viewPoint: IViewPointBiz,
    distanceToNext: number,
    transportationToNext: TransportationCategory
}

export function caculateDistance(dailyTrip : IDailyTripBiz) {
    if (!dailyTrip || !dailyTrip.travelViewPoints) return;

    for (let i = 0; i < dailyTrip.travelViewPoints.length - 1; i++) {
        let vp = dailyTrip.travelViewPoints[i];
        let vpNext = dailyTrip.travelViewPoints[i + 1];

        vp.distanceToNext = Math.round(new AMap.LngLat(vp.viewPoint.longtitude, vp.viewPoint.latitude).distance(
            new AMap.LngLat(vpNext.viewPoint.longtitude, vpNext.viewPoint.latitude)
        ));

        if (vp.transportationToNext == null) {
            vp.transportationToNext = TransportationCategory.Walking;
        }
    }

    if (dailyTrip.travelViewPoints.length > 0)
        dailyTrip.lastViewPoint = dailyTrip.travelViewPoints[dailyTrip.travelViewPoints.length - 1].id;
    else
        dailyTrip.lastViewPoint = '';
}

export function translateDailTrip(dailyTrip : IDailyTripBiz) : IDailyTrip {
    return {
        id: dailyTrip.id,
        travelViewPoints: dailyTrip.travelViewPoints.map(tvp => tvp.id)
    };
}

export function translateTravelViewPoint(travelViewPoint : ITravelViewPointBiz) : ITravelViewPoint {
    return {
        id: travelViewPoint.id,
        viewPoint: travelViewPoint.viewPoint.id,
        transportationToNext: travelViewPoint.transportationToNext
    };
}

export function translateTravelAgenda(travelAgenda : ITravelAgendaBiz) : ITravelAgenda {
    return {
        id: travelAgenda.id,
        name: travelAgenda.name,
        user: travelAgenda.user,
        cover: travelAgenda.cover,
        dailyTrips:  travelAgenda.dailyTrips.map(dt => dt.id)
    }
}