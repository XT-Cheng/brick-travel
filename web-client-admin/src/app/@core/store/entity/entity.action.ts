import { FluxStandardAction } from 'flux-standard-action';

import { IActionMetaInfo, IActionPayload } from '../store.action';
import { EntityTypeEnum } from '../store.module';
import { IEntities, STORE_ENTITIES_KEY } from './entity.model';

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
    queryCondition: IQueryCondition;
    objectId: string;
    pagination: IPagination;
    entityType: EntityTypeEnum;
    phaseType: EntityActionPhaseEnum;
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
    queryCondition: null,
    objectId: ''
};

export function getEntityKey(typeEnum: EntityTypeEnum): string {
    switch (typeEnum) {
        case EntityTypeEnum.CITY: {
            return STORE_ENTITIES_KEY.cities;
        }
        default:
            return '';
    }
}

//#region Load Actions
export function entityLoadAction(entityType: EntityTypeEnum) {
    return (queryCondition: IQueryCondition = {}, page: number = 0, limit: number = 50): EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({}, defaultEntityActionMeta, {
            progressing: true,
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            pagination: { page: page, limit: limit },
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.TRIGGER,
            queryCondition: queryCondition
        })
    });
}

export function entityLoadActionStarted(entityType: EntityTypeEnum) {
    return (): EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({}, defaultEntityActionMeta, {
            progressing: true,
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.START
        })
    });
}

export function entityLoadActionFailed(entityType: EntityTypeEnum) {
    return (error: Error): EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
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

export function entityLoadActionSucceeded(entityType: EntityTypeEnum, actionType: EntityActionTypeEnum = EntityActionTypeEnum.LOAD) {
    return (entities: IEntities): EntityAction => ({
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
//#endregion

//#region Update action
export function entityUpdateAction<T>(entityType: EntityTypeEnum) {
    return (id: string, entity: T): EntityAction => ({
        type: EntityActionTypeEnum.UPDATE,
        meta: defaultEntityActionMeta,
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            entities: { [getEntityKey(entityType)]: { [id]: entity } }
        })
    });
}
//#endregion

//#region Insert action
export function entityInsertAction<T>(entityType: EntityTypeEnum) {
    return (id: string, entity: T): EntityAction => ({
        type: EntityActionTypeEnum.INSERT,
        meta: defaultEntityActionMeta,
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            entities: { [getEntityKey(entityType)]: { [id]: entity } }
        })
    });
}
//#endregion

//#region Delete action
export function entityDeleteAction<T>(entityType: EntityTypeEnum) {
    return (id: string, entity: T): EntityAction => ({
        type: EntityActionTypeEnum.DELETE,
        meta: defaultEntityActionMeta,
        payload: Object.assign({}, defaultEntityActionPayload, {
            entityType: entityType,
            entities: { [getEntityKey(entityType)]: { [id]: entity } }
        })
    });
}
//#endregion
