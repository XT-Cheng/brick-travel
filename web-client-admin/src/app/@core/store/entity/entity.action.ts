import { FluxStandardAction } from 'flux-standard-action';

import { IBiz } from '../bizModel/biz.model';
import { IActionMetaInfo, IActionPayload } from '../store.action';
import { EntityTypeEnum, IEntities, STORE_ENTITIES_KEY } from './entity.model';

export enum EntityActionPhaseEnum {
    TRIGGER = 'TRIGGER',
    START = 'START',
    SUCCEED = 'SUCCEED',
    FAIL = 'FAIL',
    EXECUTE = 'EXECUTE'
}

export enum EntityActionTypeEnum {
    LOAD = 'ENTITY:LOAD',
    SAVE = 'ENTITY:SAVE',
    UPDATE = 'ENTITY:UPDATE',
    INSERT = 'ENTITY:INSERT',
    DELETE = 'ENTITY:DELETE',
}

export interface IPagination {
    page: number;
    limit: number;
}

export interface IQueryCondition {
    [key: string]: string;
}

export interface IEntityActionPayload extends IActionPayload {
    entities: IEntities;
    bizModel: IBiz;
    queryCondition: IQueryCondition;
    pagination: IPagination;
    entityType: EntityTypeEnum;
    phaseType: EntityActionPhaseEnum;
    dirtyMode: boolean;
}

// Flux-standard-action gives us stronger typing of our actions.
export type EntityAction = FluxStandardAction<IEntityActionPayload, IActionMetaInfo>;

const defaultEntityActionMeta: IActionMetaInfo = {
    progressing: false
};

const defaultEntityActionPayload: IEntityActionPayload = {
    pagination: null,
    entityType: null,
    phaseType: null,
    error: null,
    entities: null,
    bizModel: null,
    queryCondition: null,
    dirtyMode: false
};

export function getEntityKey(typeEnum: EntityTypeEnum): string {
    switch (typeEnum) {
        case EntityTypeEnum.CITY: {
            return STORE_ENTITIES_KEY.cities;
        }
        case EntityTypeEnum.VIEWPOINT: {
            return STORE_ENTITIES_KEY.viewPoints;
        }
        case EntityTypeEnum.USER: {
            return STORE_ENTITIES_KEY.users;
        }
        case EntityTypeEnum.FILTERCATEGORY: {
            return STORE_ENTITIES_KEY.filterCategories;
        }
        case EntityTypeEnum.TRAVELAGENDA: {
            return STORE_ENTITIES_KEY.travelAgendas;
        }
        case EntityTypeEnum.TRAVELVIEWPOINT: {
            return STORE_ENTITIES_KEY.travelViewPoints;
        }
        case EntityTypeEnum.DAILYTRIP: {
            return STORE_ENTITIES_KEY.dailyTrips;
        }
        case EntityTypeEnum.VIEWPOINTCATEGORY: {
            return STORE_ENTITIES_KEY.viewPointCatgories;
        }
        case EntityTypeEnum.TRANSPORTATIONCATEGORY: {
            return STORE_ENTITIES_KEY.transportationCatgories;
        }
        default:
            throw new Error(`Unknown EntityType ${typeEnum}`);
    }
}

export function getEntityType(type: string): EntityTypeEnum {
    switch (type) {
        case STORE_ENTITIES_KEY.cities: {
            return EntityTypeEnum.CITY;
        }
        case STORE_ENTITIES_KEY.viewPoints: {
            return EntityTypeEnum.VIEWPOINT;
        }
        case STORE_ENTITIES_KEY.users: {
            return EntityTypeEnum.USER;
        }
        case STORE_ENTITIES_KEY.filterCategories: {
            return EntityTypeEnum.FILTERCATEGORY;
        }
        case STORE_ENTITIES_KEY.travelAgendas: {
            return EntityTypeEnum.TRAVELAGENDA;
        }
        case STORE_ENTITIES_KEY.travelViewPoints: {
            return EntityTypeEnum.TRAVELVIEWPOINT;
        }
        case STORE_ENTITIES_KEY.dailyTrips: {
            return EntityTypeEnum.DAILYTRIP;
        }
        case STORE_ENTITIES_KEY.viewPointCatgories: {
            return EntityTypeEnum.VIEWPOINTCATEGORY;
        }
        case STORE_ENTITIES_KEY.transportationCatgories: {
            return EntityTypeEnum.TRANSPORTATIONCATEGORY;
        }
        default:
            return null;
    }
}

export function entityActionStarted(entityType: EntityTypeEnum) {
    return (actionType: EntityActionTypeEnum): EntityAction => ({
        type: actionType,
        meta: Object.assign({}, defaultEntityActionMeta, {
            progressing: true,
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.START
        })
    });
}

export function entityActionFailed(entityType: EntityTypeEnum) {
    return (actionType: EntityActionTypeEnum, error: any): EntityAction => ({
        type: actionType,
        error: true,
        meta: Object.assign({}, defaultEntityActionMeta, {
            progressing: false,
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.FAIL,
            error: error
        })
    });
}

export function entityActionSucceeded(entityType: EntityTypeEnum) {
    return (actionType: EntityActionTypeEnum, entities: IEntities): EntityAction => ({
        type: actionType,
        meta: Object.assign({}, defaultEntityActionMeta, {
            progressing: false,
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.SUCCEED,
            entities: entities,
        })
    });
}

//#region Load Actions
export function entityLoadAction(entityType: EntityTypeEnum) {
    return (pagination: IPagination, queryCondition: IQueryCondition): EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({}, defaultEntityActionMeta, {
            progressing: true,
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            pagination: pagination,
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.TRIGGER,
            queryCondition: queryCondition
        })
    });
}

//#endregion

//#region Update action
export function entityUpdateAction<U>(entityType: EntityTypeEnum) {
    return (id: string, bizModel: U, dirtyMode: boolean): EntityAction => ({
        type: EntityActionTypeEnum.UPDATE,
        meta: defaultEntityActionMeta,
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.TRIGGER,
            bizModel: bizModel
        })
    });
}
//#endregion

//#region Insert action
export function entityInsertAction<U>(entityType: EntityTypeEnum) {
    return (id: string, bizModel: U, dirtyMode: boolean): EntityAction => ({
        type: EntityActionTypeEnum.INSERT,
        meta: defaultEntityActionMeta,
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.TRIGGER,
            bizModel: bizModel
        })
    });
}
//#endregion

//#region Delete action
export function entityDeleteAction<U>(entityType: EntityTypeEnum) {
    return (id: string, bizModel: U, dirtyMode: boolean): EntityAction => ({
        type: EntityActionTypeEnum.DELETE,
        meta: defaultEntityActionMeta,
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.TRIGGER,
            bizModel: bizModel
        })
    });
}
//#endregion
