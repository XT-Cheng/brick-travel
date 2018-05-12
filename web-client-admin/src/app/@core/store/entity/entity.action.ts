import { FluxStandardAction } from 'flux-standard-action';

import { FileUploader } from '../../fileUpload/providers/file-uploader';
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
    bizModelId: string;
    queryCondition: IQueryCondition;
    pagination: IPagination;
    entityType: EntityTypeEnum;
    phaseType: EntityActionPhaseEnum;
    dirtyMode: boolean;
    files: Map<string, FileUploader>;
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
    bizModelId: '',
    queryCondition: null,
    dirtyMode: false,
    actionId: '',
    files: null
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
    return (actionType: EntityActionTypeEnum, error: any, actionId: string): EntityAction => ({
        type: actionType,
        error: true,
        meta: defaultEntityActionMeta,
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.FAIL,
            error: error,
            actionId: actionId
        })
    });
}

export function entityActionSucceeded(entityType: EntityTypeEnum) {
    return (actionType: EntityActionTypeEnum, entities: IEntities): EntityAction => ({
        type: actionType,
        meta: defaultEntityActionMeta,
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.SUCCEED,
            entities: entities,
        })
    });
}

//#region Load Actions
export function entityLoadAction(entityType: EntityTypeEnum) {
    return (pagination: IPagination, queryCondition: IQueryCondition, actionId: string): EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({}, defaultEntityActionMeta, {
            progressing: true,
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            pagination: pagination,
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.TRIGGER,
            queryCondition: queryCondition,
            actionId: actionId
        })
    });
}

//#endregion

//#region Update action
export function entityUpdateAction<U>(entityType: EntityTypeEnum) {
    return (id: string, bizModel: U, files: Map<string, FileUploader>, dirtyMode: boolean, actionId: string): EntityAction => ({
        type: EntityActionTypeEnum.UPDATE,
        meta: defaultEntityActionMeta,
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.TRIGGER,
            bizModel: bizModel,
            dirtyMode: dirtyMode,
            actionId: actionId,
            files: files
        })
    });
}
//#endregion

//#region Insert action
export function entityInsertAction<U>(entityType: EntityTypeEnum) {
    return (id: string, bizModel: U, files: Map<string, FileUploader>, dirtyMode: boolean, actionId: string): EntityAction => ({
        type: EntityActionTypeEnum.INSERT,
        meta: defaultEntityActionMeta,
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.TRIGGER,
            bizModel: bizModel,
            dirtyMode: dirtyMode,
            actionId: actionId,
            files: files
        })
    });
}
//#endregion

//#region Delete action
export function entityDeleteAction<U>(entityType: EntityTypeEnum) {
    return (id: string, bizModel: U, dirtyMode: boolean, actionId: string): EntityAction => ({
        type: EntityActionTypeEnum.DELETE,
        meta: defaultEntityActionMeta,
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.TRIGGER,
            bizModel: bizModel,
            bizModelId: id,
            dirtyMode: dirtyMode
        })
    });
}
//#endregion
