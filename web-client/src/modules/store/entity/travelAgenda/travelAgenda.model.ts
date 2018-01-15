export enum TransportationCategory {
    Walking,
    SmallBus,
    BigBus,
    SelfDrive
}

export interface ITravelAgenda {
    _id: string,
    name: string,
    user: string,
    cover: string,
    dailyTrips:  string[]
};

export interface IDailyTrip {
    _id: string,
    travelViewPoints:  string[],
}

export interface ITravelViewPoint {
    _id: string,
    viewPoint: string,
    transportationToNext: TransportationCategory
}