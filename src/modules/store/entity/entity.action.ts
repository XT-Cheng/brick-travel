import { FluxStandardAction } from "flux-standard-action";
import { IEntities } from "./entity.model";
import { IActionMetaInfo, IActionPayload } from "../store.action";

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
    FILTERCATEGORY = "FILTERCATEGORY"
}

export enum EntityActionTypeEnum  {
    LOAD = "ENTITY:LOAD",
    UPDATE = "ENTITY:UPDATE"
}

export function entityAction(entityActionType : EntityActionTypeEnum, entityType : EntityTypeEnum) {
    return (page: number = 0,limit: number = 50) : EntityAction => ({
        type: entityActionType,
        meta: {pagination: {page: page,limit: limit},progressing: true,entityType: entityType,phaseType: EntityActionPhaseEnum.TRIGGER},
        payload: null
    })
}

export function entityActionStarted(entityActionType : EntityActionTypeEnum, entityType : EntityTypeEnum) {
    return () : EntityAction => ({
        type: entityActionType,
        meta: {pagination:null,progressing: true, entityType: entityType,phaseType: EntityActionPhaseEnum.START},
        payload: null,
    })
}

export function entityActionFailed(entityActionType : EntityActionTypeEnum,entityType : EntityTypeEnum) {
    return (error: Error) : EntityAction => ({
        type: entityActionType,
        meta: {pagination:null,progressing: false, entityType: entityType,phaseType: EntityActionPhaseEnum.FAIL},
        payload: {entities: null,error: error}
    })
}

export function entityActionSucceeded(entityActionType : EntityActionTypeEnum, entityType : EntityTypeEnum) {
    return (entities : IEntities) : EntityAction => ({
        type: entityActionType,
        meta: {pagination:null,progressing: true, entityType: entityType,phaseType: EntityActionPhaseEnum.SUCCEED},
        payload: {entities: entities,error: null},
    })
}