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
    travelViewPoints: ITravelViewPointBiz[]
}

export interface ITravelViewPointBiz {
    id: string,
    viewPoint: IViewPointBiz,
    distanceToNext: number,
    transportationType: TransportationCategory
}