import { Injectable } from "@angular/core";

import { dispatch } from "@angular-redux/store";

import { EntityTypeEnum, EntityActionTypeEnum, entityActionStarted, entityActionFailed, entityAction, entityActionSucceeded } from "../store.action";

@Injectable()
export class ViewPointAction {
    loadViewPointStarted = entityActionStarted(EntityActionTypeEnum.LOAD,EntityTypeEnum.VIEWPOINT);

    @dispatch()
    loadViewPoints = entityAction(EntityActionTypeEnum.LOAD,EntityTypeEnum.VIEWPOINT);

    loadViewPointSucceeded = entityActionSucceeded(EntityActionTypeEnum.LOAD,EntityTypeEnum.VIEWPOINT);
    
    loadViewPointFailed  = entityActionFailed(EntityActionTypeEnum.LOAD,EntityTypeEnum.VIEWPOINT);
}