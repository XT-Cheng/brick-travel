import { FluxStandardAction } from 'flux-standard-action';

import { EntityTypeEnum } from '../entity/entity.action';
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
    FINISHED = "FINISHED",
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
    entityType: null,
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
export function dirtyFlushAction() {
    return () : DirtyAction => ({
        type: DirtyActionTypeEnum.FLUSH,
        meta: Object.assign({}, defaultDirtyActionMeta, {
            phaseType: DirtyActionPhaseEnum.TRIGGER
        }),
        payload: defaultDirtyActionPayload
    })
}

export function dirtyFlushActionStarted() {
    return () : DirtyAction => ({
        type: DirtyActionTypeEnum.FLUSH,
        meta: Object.assign({}, defaultDirtyActionMeta, {
            phaseType: DirtyActionPhaseEnum.START,
        }),
        payload: defaultDirtyActionPayload,
    })
}

export function dirtyFlushActionFailed() {
    return (error) : DirtyAction => ({
        type: DirtyActionTypeEnum.FLUSH,
        meta: Object.assign({}, defaultDirtyActionMeta, {
            phaseType: DirtyActionPhaseEnum.FAIL
        }),
        payload: Object.assign({}, defaultDirtyActionPayload, {
            error: error
        })
    })
}

export function dirtyFlushActionFinished() {
    return () : DirtyAction => ({
        type: DirtyActionTypeEnum.FLUSH,
        meta: Object.assign({}, defaultDirtyActionMeta, {
            phaseType: DirtyActionPhaseEnum.FINISHED
        }),
        payload: defaultDirtyActionPayload
    })
}
//#endregion