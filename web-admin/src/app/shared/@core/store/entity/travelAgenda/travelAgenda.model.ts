export interface ITransportationCategory {
    id: string,
    name: string,
    isDefault: boolean
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
    transportationToNext: string,
    dailyTrip: string
}