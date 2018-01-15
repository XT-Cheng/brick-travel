import { schema } from 'normalizr';

export const viewPointComment = new schema.Entity('viewPointComments',{},{idAttribute: '_id'});

export const user = new schema.Entity('users',{},{idAttribute: '_id'});

export const city = new schema.Entity('cities',{},{idAttribute: '_id'});

export const viewPoint = new schema.Entity('viewPoints',{
    comments: [ viewPointComment ],
    city: city
},{idAttribute: '_id'});

export const travelViewPoint = new schema.Entity('travelViewPoints',{
    viewPoint: viewPoint
},{idAttribute: '_id'});

export const dailyTrip = new schema.Entity('dailyTrips',{
    travelViewPoints: [travelViewPoint]
},{idAttribute: '_id'});

export const travelAgenda = new schema.Entity('travelAgendas',{
    user: user,
    dailyTrips: [dailyTrip]
},{idAttribute: '_id'});

export const filterCriteria = new schema.Entity('filterCriteries',{},{idAttribute: '_id'});

export const filterCategory = new schema.Entity('filterCategories',{
    criteries: [filterCriteria]
},{idAttribute: '_id'});