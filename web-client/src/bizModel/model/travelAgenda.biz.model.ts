import {
    IDailyTrip,
    ITravelAgenda,
    TransportationCategory,
    ITravelViewPoint,
} from '../../modules/store/entity/travelAgenda/travelAgenda.model';
import { IViewPointBiz } from './viewPoint.biz.model';

import { ObjectID } from 'bson';

export interface ITravelAgendaBiz {
    _id: string,
    name: string,
    user: string,
    cover: string,
    dailyTrips: IDailyTripBiz[]
};

export interface IDailyTripBiz {
    _id: string,
    travelViewPoints: ITravelViewPointBiz[],
    lastViewPoint: string
}

export interface ITravelViewPointBiz {
    _id: string,
    viewPoint: IViewPointBiz,
    distanceToNext: number,
    transportationToNext: TransportationCategory
}

export function caculateDistance(dailyTrip: IDailyTripBiz) {
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

    if (dailyTrip.travelViewPoints.length > 0) {
        dailyTrip.travelViewPoints[dailyTrip.travelViewPoints.length - 1].transportationToNext = null;
        dailyTrip.lastViewPoint = dailyTrip.travelViewPoints[dailyTrip.travelViewPoints.length - 1]._id;
    }
    else
        dailyTrip.lastViewPoint = '';
}

export function translateDailyTrip(dailyTrip: IDailyTripBiz): IDailyTrip {
    return {
        _id: dailyTrip._id,
        travelViewPoints: dailyTrip.travelViewPoints.map(tvp => tvp._id)
    };
}

export function translateTravelViewPoint(travelViewPoint: ITravelViewPointBiz): ITravelViewPoint {
    return {
        _id: travelViewPoint._id,
        viewPoint: travelViewPoint.viewPoint._id,
        transportationToNext: travelViewPoint.transportationToNext
    };
}

export function translateTravelAgenda(travelAgenda: ITravelAgendaBiz): ITravelAgenda {
    return {
        _id: travelAgenda._id,
        name: travelAgenda.name,
        user: travelAgenda.user,
        cover: travelAgenda.cover,
        dailyTrips: travelAgenda.dailyTrips.map(dt => dt._id)
    }
}

export function createTravelAgenda(): ITravelAgendaBiz {
    return {
        _id: new ObjectID().toHexString(),
        name: '',
        user: '',
        cover: '',
        dailyTrips: []
    }
}

export function createDailiyTrip(): IDailyTripBiz {
    return {
        _id: new ObjectID().toHexString(),
        travelViewPoints: [],
        lastViewPoint: ''
    }
}

export function createTravelViewPoint(viewPoint: IViewPointBiz): ITravelViewPointBiz {
    return {
        _id: new ObjectID().toHexString(),
        viewPoint: viewPoint,
        distanceToNext: -1,
        transportationToNext: null
    };
}