import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';

import { IActionMetaInfo, IActionPayload } from '../store.action';
import { selectDailyTripAction, selectTravelAgendaAction } from './travelAgenda/travelAgenda.action';

export interface IUIActionMetaInfo extends IActionMetaInfo {}

export interface IUIActionPayload extends IActionPayload {
    viewMode : boolean
}

export enum UIActionTypeEnum {
    SET_VIEWMODE = "UI:SET_VIEWMODE"
}

let defaultUIActionPayload = {
    viewMode: false,
    error: null,
}

export type UIAction = FluxStandardAction<IUIActionPayload, IUIActionMetaInfo>;

export function setViewModeAction(viewMode: boolean): UIAction {
    return {
        type: UIActionTypeEnum.SET_VIEWMODE,
        meta: { progressing : false },
        payload: Object.assign({},defaultUIActionPayload,{
            viewMode: viewMode
        })
    };
}

@Injectable()
export class UIActionGenerator {
    @dispatch()
    selectTravelAgenda = selectTravelAgendaAction;

    @dispatch()
    selectDailyTrip = selectDailyTripAction;

    @dispatch()
    setViewMode = setViewModeAction;
}