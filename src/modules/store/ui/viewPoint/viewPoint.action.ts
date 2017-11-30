import { FluxStandardAction } from 'flux-standard-action';

import { IViewPointBiz } from '../../../../bizModel/model/viewPoint.biz.model';
import { IActionMetaInfo, IActionPayload } from '../../store.action';

export interface IUIViewPointActionMetaInfo extends IActionMetaInfo {

}

export interface IUIViewPointActionPayload extends IActionPayload {
    searchKey?: string,
    selectedViewPointId?: string,
    selectCriteria?: {
        selectedCriteriaId: string,
        unSelectedCriteriaIds: string[]
    }
}

let defaultViewPointActionPayload = {
    searchKey: '',
    selectedViewPointId: '',
    selectCriteria: null,
    error: null,
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
        payload: Object.assign({},defaultViewPointActionPayload,{
            searchKey: searchKey
        })
    };
}

export function selectViewPointAction(viewPoint: IViewPointBiz): UIViewPointAction {
    return {
        type: UIViewPointActionTypeEnum.SELECT_VIEWPOINT,
        meta: { progressing : false },
        payload: Object.assign({},defaultViewPointActionPayload,{
            selectedViewPointId: viewPoint?viewPoint.id:''
        })
    };
}

export function selectCriteriaAction(selectedCriteriaId: string, unSelectedCriteriaIds: string[]): UIViewPointAction {
    return {
        type: UIViewPointActionTypeEnum.SELECT_CRITERIA,
        meta: { progressing : false },
        payload: Object.assign({},defaultViewPointActionPayload,{
            selectCriteria: {
                selectedCriteriaId: selectedCriteriaId,
                unSelectedCriteriaIds: unSelectedCriteriaIds
            }
        })
    };
}
