import { IEntities } from './entity/entity.model';

export enum STORE_KEY {
    entities = 'entities'
}

export interface IAppState {
    entities: IEntities;
}

/*
    entities: {},
*/
