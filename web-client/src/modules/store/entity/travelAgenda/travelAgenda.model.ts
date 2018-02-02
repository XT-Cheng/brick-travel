export enum TransportationCategory {
    Walking,
    SmallBus,
    BigBus,
    SelfDrive
}

export interface ITravelAgenda {
    id: string,
    name: string,
    user: string,
    cover: string,
    dailyTrips:  string[]
};

export interface IDailyTrip {
    id: string,
    travelViewPoints:  string[],
    travelAgenda: string
}

export interface ITravelViewPoint {
    id: string,
    viewPoint: string,
    transportationToNext: TransportationCategory,
    dailyTrip: string
}