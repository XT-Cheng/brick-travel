import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';

import { IUIActionMetaInfo, IUIActionPayload } from '../ui.action';

export interface IUIViewPointActionMetaInfo extends IUIActionMetaInfo {

}

export interface IUIViewPointActionPayload extends IUIActionPayload {
    searchKey?: string,
    selectCriteria?: {
        selectedCriteriaId: string,
        unSelectedCriteriaIds: string[]
    }
}

export type UIViewPointAction = FluxStandardAction<IUIViewPointActionPayload, IUIViewPointActionMetaInfo>;

export enum UIViewPointActionTypeEnum {
    SEARCH_VIEWPOINT = "UI:VIEWPOINT:SEARCH_VIEWPOINT",
    SELECT_CRITERIA = "UI:VIEWPOINT:SELECT_CRITERIA"
}

export function searchViewPointAction(searchKey: string): UIViewPointAction {
    return {
        type: UIViewPointActionTypeEnum.SEARCH_VIEWPOINT,
        meta: null,
        payload: { searchKey: searchKey, error: null }
    };
}

export function selectCriteriaAction(selectedCriteriaId: string, unSelectedCriteriaIds: string[]): UIViewPointAction {
    return {
        type: UIViewPointActionTypeEnum.SELECT_CRITERIA,
        meta: null,
        payload: {
            selectCriteria: {
                selectedCriteriaId: selectedCriteriaId,
                unSelectedCriteriaIds: unSelectedCriteriaIds
            },
            error: null
        }
    };
}

@Injectable()
export class UIActionGenerator {
    @dispatch()
    searchViewPoint = searchViewPointAction;

    @dispatch()
    selectCriteria = selectCriteriaAction;
}
