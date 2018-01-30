import { schema } from 'normalizr';

export const viewPointComment = new schema.Entity('viewPointComments');

export const user = new schema.Entity('users',{},{idAttribute: '_id'});

export const city = new schema.Entity('cities');

export const viewPoint = new schema.Entity('viewPoints',{
    comments: [ viewPointComment ],
    city: city
});

export const travelViewPoint = new schema.Entity('travelViewPoints',{
    viewPoint: viewPoint
});

export const dailyTrip = new schema.Entity('dailyTrips',{
    travelViewPoints: [travelViewPoint]
});

export const travelAgenda = new schema.Entity('travelAgendas',{
    dailyTrips: [dailyTrip]
});

export const filterCriteria = new schema.Entity('filterCriteries');

export const filterCategory = new schema.Entity('filterCategories',{
    criteries: [filterCriteria]
});