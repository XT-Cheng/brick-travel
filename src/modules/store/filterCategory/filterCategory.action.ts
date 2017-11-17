import { Injectable } from "@angular/core";

import { dispatch } from "@angular-redux/store";

import { EntityTypeEnum, EntityActionTypeEnum, entityActionStarted, entityActionFailed, entityAction, entityActionSucceeded } from "../store.action";

@Injectable()
export class FilterCategoryAction {
    loadFilterCategoryStarted = entityActionStarted(EntityActionTypeEnum.LOAD,EntityTypeEnum.FILTERCATEGORY);

    @dispatch()
    loadFilterCategories = entityAction(EntityActionTypeEnum.LOAD,EntityTypeEnum.FILTERCATEGORY);

    loadFilterCategorySucceeded = entityActionSucceeded(EntityActionTypeEnum.LOAD,EntityTypeEnum.FILTERCATEGORY);
    
    loadFilterCategoryFailed  = entityActionFailed(EntityActionTypeEnum.LOAD,EntityTypeEnum.FILTERCATEGORY);
}