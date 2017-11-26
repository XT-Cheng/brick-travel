import { IViewPointBiz } from "./viewPoint.biz.model";
import { TransportationCategory } from "../../modules/store/entity/travelAgenda/travelAgenda.model";

export interface ITravelAgendaBiz {
    id: string,
    name: string,
    user: string,
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
    }

    dailyTrip.lastViewPoint = dailyTrip.travelViewPoints[dailyTrip.travelViewPoints.length - 1].id;
}