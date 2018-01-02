import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import {
    entityLoadAction,
    entityLoadActionFailed,
    entityLoadActionStarted,
    entityLoadActionSucceeded,
    EntityTypeEnum,
} from '../entity.action';

@Injectable()
export class FilterCategoryActionGenerator {
    loadFilterCategoryStarted = entityLoadActionStarted(EntityTypeEnum.FILTERCATEGORY);

    @dispatch()
    loadFilterCategories = entityLoadAction(EntityTypeEnum.FILTERCATEGORY);

    loadFilterCategorySucceeded = entityLoadActionSucceeded(EntityTypeEnum.FILTERCATEGORY);
    
    loadFilterCategoryFailed  = entityLoadActionFailed(EntityTypeEnum.FILTERCATEGORY);
}