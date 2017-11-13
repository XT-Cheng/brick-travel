import { IViewPoint } from "../viewPoint/model"

export enum TransportationCategory {
    Walking,
    SmallBus,
    BigBus,
    SelfDrive
}

export interface ITravelAgenda {
    id: string;
    name: string;
    user: string;
    dailyTrips: IDailyTrip[] | string[]
};

export interface IDailyTrip {
    id: string;
    travelViewPoints: ITravelViewPoint[] | string[];
}

export interface ITravelViewPoint {
    id: string,
    viewPoint: IViewPoint;
    distanceToNext: number;
    transportationType: TransportationCategory;
}