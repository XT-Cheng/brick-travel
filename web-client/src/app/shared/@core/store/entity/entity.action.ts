import { FluxStandardAction } from 'flux-standard-action';

import { IActionMetaInfo, IActionPayload } from '../store.action';
import { IEntities, INIT_ENTITY_STATE, STORE_ENTITIES_KEY } from './entity.model';

export interface IEntityActionMetaInfo extends IActionMetaInfo {
    pagination: IPagination;
    entityType: EntityTypeEnum;
    phaseType: EntityActionPhaseEnum;
}

export interface IPagination {
    page: number;
    limit: number;
}

export interface IQueryCondition {
    [key: string]: string;
}

export interface IEntityActionPayload extends IActionPayload {
    entities: IEntities
    queryCondition: IQueryCondition,
    objectId : string
}

// Flux-standard-action gives us stronger typing of our actions.
export type EntityAction = FluxStandardAction<IEntityActionPayload, IEntityActionMetaInfo>;

export enum EntityActionPhaseEnum {
    TRIGGER = "TRIGGER",
    START = "START",
    SUCCEED = "SUCCEED",
    FAIL = "FAIL",
    EXECUTE = "EXECUTE"
}

export enum EntityTypeEnum {
    CITY = "CITY",
    VIEWPOINT = "VIEWPOINT",
    VIEWPOINTCOMMENT = "VIEWPOINTCOMMENT",
    TRAVELAGENDA = "TRAVELAGENDA",
    DAILYTRIP = "DAILYTRIP",
    FILTERCATEGORY = "FILTERCATEGORY",
    TRAVELVIEWPOINT = "TRAVELVIEWPOINT",
    USER = "USER",
    MASTER_DATA = "MASTER_DATA"
}

export enum EntityActionTypeEnum {
    LOAD = "ENTITY:LOAD",
    SAVE = "ENTITY:SAVE",
    UPDATE = "ENTITY:UPDATE",
    INSERT = "ENTITY:INSERT",
    DELETE = "ENTITY:DELETE",
    FLUSH = "ENTITY:FLUSH",
    APPEND_COMMENTS = "ENTITY:APPEND_COMMENTS",
}

const defaultEntityActionPayload = {
    error: null,
    entities: {},
    queryCondition: {},
    objectId: ''
}

const defaultEntityActionMeta = {
    pagination: null,
    phaseType: EntityActionPhaseEnum.EXECUTE,
    progressing: false
}

export function getEntityKey(typeEnum : EntityTypeEnum ) : string {
    switch(typeEnum) {
        case EntityTypeEnum.CITY: {
            return STORE_ENTITIES_KEY.cities;
        }
        case EntityTypeEnum.DAILYTRIP: {
            return STORE_ENTITIES_KEY.dailyTrips;
        }
        case EntityTypeEnum.TRAVELAGENDA: {
            return STORE_ENTITIES_KEY.travelAgendas;
        }
        case EntityTypeEnum.TRAVELVIEWPOINT: {
            return STORE_ENTITIES_KEY.travelViewPoints;
        }
        case EntityTypeEnum.FILTERCATEGORY: {
            return STORE_ENTITIES_KEY.filterCategories
        }
        case EntityTypeEnum.VIEWPOINT: {
            return STORE_ENTITIES_KEY.viewPoints
        }
        case EntityTypeEnum.USER: {
            return STORE_ENTITIES_KEY.users
        }
        default:
            return '';
    }
}

export function getEntityType(type : string ) : EntityTypeEnum {
    switch(type) {
        case STORE_ENTITIES_KEY.cities: {
            return EntityTypeEnum.CITY;
        }
        case STORE_ENTITIES_KEY.users: {
            return EntityTypeEnum.USER;
        }
        case STORE_ENTITIES_KEY.dailyTrips: {
            return  EntityTypeEnum.DAILYTRIP;
        }
        case STORE_ENTITIES_KEY.travelAgendas: {
            return  EntityTypeEnum.TRAVELAGENDA;
        }
        case STORE_ENTITIES_KEY.travelViewPoints: {
            return  EntityTypeEnum.TRAVELVIEWPOINT;
        }
        case STORE_ENTITIES_KEY.filterCategories: {
            return EntityTypeEnum.FILTERCATEGORY;
        }
        default:
            return null;
    }
}

//#region Load Actions
export function entityLoadAction(entityType: EntityTypeEnum) {
    return (queryCondition: IQueryCondition = {}, page: number = 0, limit: number = 50): EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({}, defaultEntityActionMeta, {
            pagination: { page: page, limit: limit },
            progressing: true,
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.TRIGGER
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            queryCondition: queryCondition
        })
    })
}

export function entityLoadActionStarted(entityType: EntityTypeEnum) {
    return (): EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({}, defaultEntityActionMeta, {
            progressing: true,
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.START
        }),
        payload: defaultEntityActionPayload,
    })
}

export function entityLoadActionFailed(entityType: EntityTypeEnum) {
    return (error: Error): EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType, 
            phaseType: EntityActionPhaseEnum.FAIL
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            error: error
        })
    })
}

export function entityLoadActionSucceeded(entityType: EntityTypeEnum,actionType: EntityActionTypeEnum = EntityActionTypeEnum.LOAD) {
    return (entities: IEntities): EntityAction => ({
        type: actionType,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.SUCCEED
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            entities: entities
        })
    })
}
//#endregion

//#region Update action
export function entityUpdateAction<T>(entityType: EntityTypeEnum) {
    return (id: string, entity: T): EntityAction => ({
        type: EntityActionTypeEnum.UPDATE,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            entities: Object.assign({}, INIT_ENTITY_STATE, { [getEntityKey(entityType)]: { [id]: entity } })
        })
    })
}
//#endregion

//#region Insert action
export function entityInsertAction<T>(entityType: EntityTypeEnum) {
    return (id: string, entity: T): EntityAction => ({
        type: EntityActionTypeEnum.INSERT,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            entities: Object.assign({}, INIT_ENTITY_STATE, { [getEntityKey(entityType)]: { [id]: entity } })
        })
    })
}
//#endregion

//#region Delete action
export function entityDeleteAction<T>(entityType: EntityTypeEnum) {
    return (id: string, entity: T): EntityAction => ({
        type: EntityActionTypeEnum.DELETE,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            entities: Object.assign({}, INIT_ENTITY_STATE, { [getEntityKey(entityType)]: { [id]: entity } })
        })
    })
}
//#endregion