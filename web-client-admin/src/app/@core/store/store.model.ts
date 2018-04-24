import { IEntities, INIT_ENTITY_STATE } from './entity/entity.model';

export enum STORE_KEY {
    entities = 'entities',
    error = 'error'
}

export interface IAppState {
    entities: IEntities;
    error: IError;
    progress: IProgress;
}

export interface IError {
    description: string;
    stack: string;
    network: boolean;
}

export interface IProgress {
    progressing: boolean;
}

export const INIT_APP_STATE: IAppState = {
    entities: INIT_ENTITY_STATE,
    error: null,
    progress: { progressing: false }
};

/*
    entities: {},
*/
