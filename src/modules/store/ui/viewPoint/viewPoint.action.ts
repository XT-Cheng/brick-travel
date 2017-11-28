import { FluxStandardAction } from 'flux-standard-action';

import { IUIActionMetaInfo, IUIActionPayload } from '../ui.action';

export interface IUIViewPointActionMetaInfo extends IUIActionMetaInfo {

}

export interface IUIViewPointActionPayload extends IUIActionPayload {
    searchKey?: string,
    selectedViewPointId?: string,
    selectCriteria?: {
        selectedCriteriaId: string,
        unSelectedCriteriaIds: string[]
    }
}

export type UIViewPointAction = FluxStandardAction<IUIViewPointActionPayload, IUIViewPointActionMetaInfo>;

export enum UIViewPointActionTypeEnum {
    SEARCH_VIEWPOINT = "UI:VIEWPOINT:SEARCH_VIEWPOINT",
    SELECT_VIEWPOINT = "UI:VIEWPOINT:SELECT_VIEWPOINT",
    SELECT_CRITERIA = "UI:VIEWPOINT:SELECT_CRITERIA"
}

export function searchViewPointAction(searchKey: string): UIViewPointAction {
    return {
        type: UIViewPointActionTypeEnum.SEARCH_VIEWPOINT,
        meta: null,
        payload: { searchKey: searchKey, error: null }
    };
}

export function selectViewPointAction(selectedViewPointId: string): UIViewPointAction {
    return {
        type: UIViewPointActionTypeEnum.SELECT_VIEWPOINT,
        meta: null,
        payload: { selectedViewPointId: selectedViewPointId, error: null }
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
