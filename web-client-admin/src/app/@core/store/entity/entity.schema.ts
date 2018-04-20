import { schema } from 'normalizr';

import { STORE_ENTITIES_KEY } from './entity.model';

export const city = new schema.Entity(STORE_ENTITIES_KEY.cities);
