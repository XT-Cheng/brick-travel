import { Injectable } from "@angular/core";

import { IViewPoint, IViewPointComment } from "./model";
import { dispatch } from "@angular-redux/store";

import { GeneralAction } from "../action";

@Injectable()
export class ViewPointAction {
    static readonly LOAD_VIEWPOINTS = 'LOAD_VIEWPOINTS';
    static readonly LOAD_VIEWPOINTS_STARTED = 'LOAD_VIEWPOINTS_STARTED';
    static readonly LOAD_VIEWPOINTS_SUCCEEDED = 'LOAD_VIEWPOINTS_SUCCEEDED';
    static readonly LOAD_VIEWPOINTS_FAILED = 'LOAD_VIEWPOINTS_FAILED';
    
    loadViewPointStarted = (): GeneralAction => ({
        type: ViewPointAction.LOAD_VIEWPOINTS_STARTED,
        meta: {progressing: true},
        payload: null,
    })

    @dispatch()
    loadViewPoints = (page: number = 0,limit: number = 50): GeneralAction => ({
        type: ViewPointAction.LOAD_VIEWPOINTS,
        meta: {pagination: {page: page,limit: limit}},
        payload: null,
    });

    loadViewPointSucceeded = (viewPoints: IViewPoint[],comments: IViewPointComment[]): GeneralAction => ({
        type: ViewPointAction.LOAD_VIEWPOINTS_SUCCEEDED,
        meta: {progressing: false},
        payload: {entities: {viewPoints: viewPoints,viewPointComments: comments}}
    })
    
    loadViewPointFailed = (error: Error): GeneralAction => ({
        type: ViewPointAction.LOAD_VIEWPOINTS_FAILED,
        meta: {progressing: false},
        payload: {error: error}
    })
}