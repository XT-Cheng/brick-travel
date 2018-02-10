import { FluxStandardAction } from 'flux-standard-action';

import { EntityActionPhaseEnum, EntityTypeEnum } from '../entity/entity.action';
import { IActionMetaInfo, IActionPayload } from '../store.action';

export interface IDirtyActionMetaInfo extends IActionMetaInfo {
    entityType: EntityTypeEnum,
    phaseType: DirtyActionPhaseEnum,
    dirtyType?: DirtyTypeEnum
}

export interface IDirtyActionPayload extends IActionPayload {
    dirtyId: string
}

export enum DirtyActionPhaseEnum {
    TRIGGER = "TRIGGER",
    START = "START",
    SUCCEED = "SUCCEED",
    FAIL = "FAIL",
    EXECUTE = "EXECUTE"
}

export enum DirtyActionTypeEnum {
    ADD = "DIRTY:ADD",
    REMOVE = "DIRTY:REMOVE",
    FLUSH = "DIRTY:FLUSH"
}

export enum DirtyTypeEnum {
    CREATED = "created",
    UPDATED = "updated",
    DELETED = "deleted"
}

// Flux-standard-action gives us stronger typing of our actions.
export type DirtyAction = FluxStandardAction<IDirtyActionPayload, IDirtyActionMetaInfo>;

const defaultDirtyActionPayload = {
    error: null,
    dirtyId: ''
}

const defaultDirtyActionMeta = {
    phaseType: DirtyActionPhaseEnum.EXECUTE,
    progressing: false
}

//#region Add Actions
export function dirtyAddAction(entityType: EntityTypeEnum) {
    return (id : string,dirtyType : DirtyTypeEnum): DirtyAction => ({
        type: DirtyActionTypeEnum.ADD,
        meta: Object.assign({}, defaultDirtyActionMeta, {
            entityType: entityType,
            dirtyType: dirtyType
        }),
        payload: Object.assign({}, defaultDirtyActionPayload, {
            dirtyId: id
        })
    })
}
//#endregion

//#region Remove action
export function dirtyRemoveAction(entityType: EntityTypeEnum) {
    return (id : string,dirtyType : DirtyTypeEnum): DirtyAction => ({
        type: DirtyActionTypeEnum.REMOVE,
        meta: Object.assign({}, defaultDirtyActionMeta, {
            entityType: entityType,
            dirtyType: dirtyType
        }),
        payload: Object.assign({}, defaultDirtyActionPayload, {
            dirtyId: id
        })
    })
}
//#endregion

//#region Flush action
export function dirtyFlushAction(entityType: EntityTypeEnum) {
    return (): DirtyAction => ({
        type: DirtyActionTypeEnum.FLUSH,
        meta: Object.assign({}, defaultDirtyActionMeta, {
            entityType: entityType,
            phaseType: DirtyActionPhaseEnum.TRIGGER
        }),
        payload: defaultDirtyActionPayload
    })
}

export function dirtyFlushActionStarted(entityType: EntityTypeEnum) {
    return (): DirtyAction => ({
        type: DirtyActionTypeEnum.FLUSH,
        meta: Object.assign({}, defaultDirtyActionMeta, {
            progressing: true,
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.START
        }),
        payload: defaultDirtyActionPayload,
    })
}

export function dirtyFlushActionFailed(entityType: EntityTypeEnum) {
    return (error: Error): DirtyAction => ({
        type: DirtyActionTypeEnum.FLUSH,
        meta: Object.assign({}, defaultDirtyActionMeta, {
            entityType: entityType, 
            phaseType: EntityActionPhaseEnum.FAIL
        }),
        payload: Object.assign({}, defaultDirtyActionPayload, {
            error: error
        })
    })
}

export function dirtyFlushActionSucceeded(entityType: EntityTypeEnum) {
    return (): DirtyAction => ({
        type: DirtyActionTypeEnum.FLUSH,
        meta: Object.assign({}, defaultDirtyActionMeta, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.SUCCEED
        }),
        payload: defaultDirtyActionPayload
    })
}
//#endregion