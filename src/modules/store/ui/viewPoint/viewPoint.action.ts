import { FluxStandardAction } from 'flux-standard-action';

import { IUIActionMetaInfo, IUIActionPayload } from '../ui.action';
import { IViewPointBiz } from '../../../../bizModel/model/viewPoint.biz.model';

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
        meta: { progressing : false },
        payload: { searchKey: searchKey, error: null}
    };
}

export function selectViewPointAction(viewPoint: IViewPointBiz): UIViewPointAction {
    return {
        type: UIViewPointActionTypeEnum.SELECT_VIEWPOINT,
        meta: { progressing : false },
        payload: { selectedViewPointId: viewPoint?viewPoint.id:'', error: null }
    };
}

export function selectCriteriaAction(selectedCriteriaId: string, unSelectedCriteriaIds: string[]): UIViewPointAction {
    return {
        type: UIViewPointActionTypeEnum.SELECT_CRITERIA,
        meta: { progressing : false },
        payload: {
            selectCriteria: {
                selectedCriteriaId: selectedCriteriaId,
                unSelectedCriteriaIds: unSelectedCriteriaIds
            },
            error: null
        }
    };
}
