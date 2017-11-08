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
