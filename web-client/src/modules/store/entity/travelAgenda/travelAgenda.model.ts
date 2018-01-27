import { IPersistentStatus } from "../entity.model";

export enum TransportationCategory {
    Walking,
    SmallBus,
    BigBus,
    SelfDrive
}

export interface ITravelAgenda extends IPersistentStatus {
    id: string,
    name: string,
    user: string,
    cover: string,
    dailyTrips:  string[]
};

export interface IDailyTrip {
    id: string,
    travelViewPoints:  string[],
}

export interface ITravelViewPoint {
    id: string,
    viewPoint: string,
    transportationToNext: TransportationCategory
}