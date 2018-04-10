import { schema } from 'normalizr';
import { STORE_ENTITIES_KEY } from './entity.model';

export const viewPointComment = new schema.Entity(STORE_ENTITIES_KEY.viewPointComments);

export const user = new schema.Entity(STORE_ENTITIES_KEY.users);

export const city = new schema.Entity(STORE_ENTITIES_KEY.cities);

export const viewPointCategory = new schema.Entity(STORE_ENTITIES_KEY.viewPointCatgories);

export const viewPoint = new schema.Entity(STORE_ENTITIES_KEY.viewPoints,{
    comments: [ viewPointComment ],
    city: city
});

export const travelViewPoint = new schema.Entity(STORE_ENTITIES_KEY.travelViewPoints,{
    viewPoint: viewPoint
});

export const dailyTrip = new schema.Entity(STORE_ENTITIES_KEY.dailyTrips,{
    travelViewPoints: [travelViewPoint]
});

export const travelAgenda = new schema.Entity(STORE_ENTITIES_KEY.travelAgendas,{
    dailyTrips: [dailyTrip]
});

dailyTrip.define({'travelAgenda': travelAgenda});
travelViewPoint.define({'dailyTrip' : dailyTrip});

export const filterCriteria = new schema.Entity(STORE_ENTITIES_KEY.filterCriteries);

export const filterCategory = new schema.Entity(STORE_ENTITIES_KEY.filterCategories,{
    criteries: [filterCriteria]
});