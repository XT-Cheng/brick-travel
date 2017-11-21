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
    SEARCH = "UI:SEARCH",
}

export function searchAction(searchKey : string) : UIAction {
    return {
        type: UIActionTypeEnum.SEARCH,
        meta: null,
        payload: {searchKey: searchKey, error: null}
    };
}

@Injectable()
export class ViewPointAction {
    @dispatch()
    search = searchAction;
}
