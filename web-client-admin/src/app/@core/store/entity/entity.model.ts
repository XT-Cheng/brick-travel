import { ICity } from './city/city.model';

export enum STORE_ENTITIES_KEY {
    cities = 'cities',
}

export interface IEntity {
    id: string;
}

export interface IEntities {
    cities: { [id: string]: ICity };
}

export const INIT_ENTITY_STATE: IEntities = {
    cities: {}
};

// {} |
