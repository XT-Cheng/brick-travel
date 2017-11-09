import { Injectable } from "@angular/core";

import { IViewPoint, IViewPointComment } from "./model";
import { dispatch } from "@angular-redux/store";

import { GeneralAction, IPagination, loadEntity } from "../action";

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

    // @dispatch()
    // loadViewPoints = loadEntity(page: number = 0,limit: number = 50): GeneralAction => ({
    //     type: ViewPointAction.LOAD_VIEWPOINTS,
    //     meta: {pagination: {page: page,limit: limit}},
    //     payload: null,
    // });

    @dispatch()
    loadViewPoints = loadEntity();

    loadViewPointSucceeded = (viewPoints: IViewPoint[],comments: IViewPointComment[],pagination : IPagination): GeneralAction => ({
        type: ViewPointAction.LOAD_VIEWPOINTS_SUCCEEDED,
        meta: {progressing: false,pagination: pagination},
        payload: {entities: {viewPoints: viewPoints,viewPointComments: comments}}
    })
    
    loadViewPointFailed = (error: Error): GeneralAction => ({
        type: ViewPointAction.LOAD_VIEWPOINTS_FAILED,
        meta: {progressing: false},
        payload: {error: error}
    })
}