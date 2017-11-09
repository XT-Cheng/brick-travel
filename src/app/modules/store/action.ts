import { FluxStandardAction } from "flux-standard-action";
import { IEntities } from "./model";

export interface IMetaInfo {
    pagination?: IPagination;
    progressing?: boolean;
}
  
export interface IPagination {
    page: number;
    limit: number;
}

export interface IPayload {
    entities?: IEntities,
    error?: Error
}

// Flux-standard-action gives us stronger typing of our actions.
export type GeneralAction = FluxStandardAction<IPayload, IMetaInfo>;

export enum ActionType {
    LOAD_ENTITY = "LOAD_ENTITY",
    UPDATE_ENTITY = "UPDATE_ENTITY",
    DELETE_ENTITY = "DELETE_ENTITY",
    CREATE_ENTITY = "CREATE_ENTITY"
}

export function loadEntity() {
    return (page: number = 0,limit: number = 50) : GeneralAction => ({
        type: ActionType.LOAD_ENTITY,
        meta: {pagination: {page: page,limit: limit},progressing: true},
        payload: null,
    })
}
