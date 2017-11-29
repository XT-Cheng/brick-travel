import { FluxStandardAction } from 'flux-standard-action';

import { IActionMetaInfo, IActionPayload } from '../store.action';
import { IEntities, INIT_ENTITY_STATE } from './entity.model';

export interface IEntityActionMetaInfo extends IActionMetaInfo {
    pagination: IPagination;
    entityType: EntityTypeEnum;
    phaseType: EntityActionPhaseEnum;
}
  
export interface IPagination {
    page: number;
    limit: number;
}

export interface IEntityActionPayload extends IActionPayload {
    entities: IEntities
}

// Flux-standard-action gives us stronger typing of our actions.
export type EntityAction = FluxStandardAction<IEntityActionPayload, IEntityActionMetaInfo>;

export enum EntityActionPhaseEnum{
    TRIGGER = "TRIGGER",
    START = "START",
    SUCCEED = "SUCCEED",
    FAIL = "FAIL",
}

export enum EntityTypeEnum {
    CITY = "CITY",
    VIEWPOINT = "VIEWPOINT",
    VIEWPOINTCOMMENT = "VIEWPOINTCOMMENT",
    TRAVELAGENDA = "TRAVELAGENDA",
    DAILYTRIP = "DAILYTRIP",
    FILTERCATEGORY = "FILTERCATEGORY"
}

export enum EntityActionTypeEnum  {
    LOAD = "ENTITY:LOAD",
    SAVE = "ENTITY:SAVE",
    UPDATE = "ENTITY:UPDATE"
}

let defaultEntityActionPayload = {
    error: null,
    entities: null
}

let defaultEntityActionMeta = {
    pagination: null,
    phaseType: EntityActionPhaseEnum.SUCCEED,
    progressing: false
}


//#region Load Actions
export function entityLoadAction(entityType : EntityTypeEnum) {
    return (page: number = 0,limit: number = 50) : EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({},defaultEntityActionMeta,{
            pagination: {page: page,limit: limit},progressing: true,entityType: entityType,phaseType: EntityActionPhaseEnum.TRIGGER
        }),
        payload: defaultEntityActionPayload
    })
}

export function entityLoadActionStarted( entityType : EntityTypeEnum) {
    return () : EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({},defaultEntityActionMeta,{
            progressing: true, entityType: entityType,phaseType: EntityActionPhaseEnum.START
        }),
        payload: defaultEntityActionPayload,
    })
}

export function entityLoadActionFailed(entityType : EntityTypeEnum) {
    return (error: Error) : EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({},defaultEntityActionMeta,{
            entityType: entityType,phaseType: EntityActionPhaseEnum.FAIL
        }),
        payload: Object.assign({},defaultEntityActionPayload,{
            error: error
        })
    })
}

export function entityLoadActionSucceeded(entityType : EntityTypeEnum) {
    return (entities : IEntities) : EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({},defaultEntityActionMeta,{
            entityType: entityType
        }),
        payload: Object.assign({},defaultEntityActionPayload,{
            entities: entities
        })
    })
}
//#endregion

//#region Update action
export function entityUpdateAction<T>(entityType : EntityTypeEnum,entityKey : string) {
    return (id: string,entity : T) : EntityAction => ({
        type: EntityActionTypeEnum.UPDATE,
        meta: Object.assign({},defaultEntityActionMeta,{
            entityType: entityType
        }),
        payload: Object.assign({},defaultEntityActionPayload,{
            entities: Object.assign({},INIT_ENTITY_STATE,{[entityKey]: {[id] : entity }})
        })
    })
}
//#endregion