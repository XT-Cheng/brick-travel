import { schema } from 'normalizr';

export const viewPointComment = new schema.Entity('viewPointComments');

export const viewPoint = new schema.Entity('viewPoints',{
    comments: [ viewPointComment ]
});

export const city = new schema.Entity('cities');
