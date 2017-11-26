import { IViewPoint } from "../viewPoint/viewPoint.model"

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
    dailyTrips:  string[]
};

export interface IDailyTrip {
    id: string;
    travelViewPoints:  string[];
}

export interface ITravelViewPoint {
    id: string,
    viewPoint: IViewPoint;
    transportationToNext: TransportationCategory;
}