import { Injectable } from "@angular/core";

import { FluxStandardAction } from 'flux-standard-action';

import { IViewPoint } from "./model";
import { dispatch } from "@angular-redux/store";
import { IError } from "../model";

// Flux-standard-action gives us stronger typing of our actions.
type Payload = IViewPoint[] | Error;
type MetaData = any;
export type ViewPointActionType = FluxStandardAction<Payload, MetaData>;

@Injectable()
export class ViewPointAction {
    static readonly LOAD_VIEWPOINTS = 'LOAD_VIEWPOINTS';
    static readonly LOAD_VIEWPOINTS_STARTED = 'LOAD_VIEWPOINTS_STARTED';
    static readonly LOAD_VIEWPOINTS_SUCCEEDED = 'LOAD_VIEWPOINTS_SUCCEEDED';
    static readonly LOAD_VIEWPOINTS_FAILED = 'LOAD_VIEWPOINTS_FAILED';
    
    loadViewPointStarted = (): ViewPointActionType => ({
        type: ViewPointAction.LOAD_VIEWPOINTS_STARTED,
        meta: null,
        payload: null,
    })

    @dispatch()
    loadViewPoints = (): ViewPointActionType => ({
        type: ViewPointAction.LOAD_VIEWPOINTS,
        meta: null,
        payload: null,
    });

    loadViewPointSucceeded = (payload: Payload): ViewPointActionType => ({
        type: ViewPointAction.LOAD_VIEWPOINTS_SUCCEEDED,
        meta: null,
        payload,
    })
    
    loadViewPointFailed = (error: Error): ViewPointActionType => ({
        type: ViewPointAction.LOAD_VIEWPOINTS_FAILED,
        meta: null,
        payload: error,
        error: true,
    })
}