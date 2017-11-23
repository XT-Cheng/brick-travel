import { IActionMetaInfo, IActionPayload } from "../store.action";
import { FluxStandardAction } from "flux-standard-action";
import { Injectable } from "@angular/core";
import { dispatch } from "@angular-redux/store";

export interface IUIActionMetaInfo extends IActionMetaInfo {

}

export interface IUIActionPayload extends IActionPayload {
    searchKey?: string,
    selectCriteria?: {
        selectedCriteriaId?: string,
        unSelectedCriteriaIds?: string[]
    }    
}

export type UIAction = FluxStandardAction<IUIActionPayload, IUIActionMetaInfo>;

export enum UIActionTypeEnum {
    SEARCH_VIEWPOINT = "UI:SEARCH_VIEWPOINT",
    SELECT_CRITERIA = "UI:SELECT_CRITERIA"
}

export function searchViewPointAction(searchKey: string): UIAction {
    return {
        type: UIActionTypeEnum.SEARCH_VIEWPOINT,
        meta: null,
        payload: { searchKey: searchKey, error: null }
    };
}

export function selectCriteriaAction(selectedCriteriaId: string,unSelectedCriteriaIds: string[]): UIAction {
    return {
        type: UIActionTypeEnum.SELECT_CRITERIA,
        meta: null,
        payload: {
            selectCriteria:{
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
