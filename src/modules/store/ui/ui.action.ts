import { IActionMetaInfo, IActionPayload } from "../store.action";
import { FluxStandardAction } from "flux-standard-action";
import { Injectable } from "@angular/core";
import { dispatch } from "@angular-redux/store";

export interface IUIActionMetaInfo extends IActionMetaInfo {
    
}

export interface IUIActionPayload extends IActionPayload {
    searchKey: string
}

export type UIAction = FluxStandardAction<IUIActionPayload, IUIActionMetaInfo>;

export enum UIActionTypeEnum  {
    SEARCH_VIEWPOINT = "UI:SEARCH_VIEWPOINT",
}

export function searchViewPointAction(searchKey : string) : UIAction {
    return {
        type: UIActionTypeEnum.SEARCH_VIEWPOINT,
        meta: null,
        payload: {searchKey: searchKey, error: null}
    };
}

@Injectable()
export class UIActionGenerator {
    @dispatch()
    searchViewPoint = searchViewPointAction;
}
