import { IEntities, INIT_ENTITY_STATE } from './entity/entity.model';
import { INIT_UI_STATE, IUIState } from './ui/ui.model';

export enum STORE_KEY {
    entities = 'entities',
    error = 'error',
    ui = 'ui'
}

export interface IAppState {
    entities: IEntities;
    ui: IUIState;
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
    ui: INIT_UI_STATE,
    error: null,
    progress: { progressing: false }
};

/*
    entities: {},
*/
