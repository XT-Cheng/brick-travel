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
    return (actionType: EntityActionTypeEnum, error: Error): EntityAction => ({
        type: actionType,
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
    return (pagination: IPagination, queryCondition: IQueryCondition = {}): EntityAction => ({
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
