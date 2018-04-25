import { schema } from 'normalizr';

import { STORE_ENTITIES_KEY } from './entity.model';

export const user = new schema.Entity(STORE_ENTITIES_KEY.users);

export const city = new schema.Entity(STORE_ENTITIES_KEY.cities);

export const viewPointComment = new schema.Entity(STORE_ENTITIES_KEY.viewPointComments);

export const viewPointCategory = new schema.Entity(STORE_ENTITIES_KEY.viewPointCatgories);

export const viewPoint = new schema.Entity(STORE_ENTITIES_KEY.viewPoints, {
    comments: [viewPointComment],
    city: city,
    category: viewPointCategory
});
