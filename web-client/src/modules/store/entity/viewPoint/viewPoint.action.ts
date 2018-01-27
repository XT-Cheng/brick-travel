import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import {
    entityLoadAction,
    entityLoadActionFailed,
    entityLoadActionStarted,
    entityLoadActionSucceeded,
    EntityTypeEnum,
    EntityActionTypeEnum,
} from '../entity.action';

@Injectable()
export class ViewPointActionGenerator {
    loadViewPointStarted = entityLoadActionStarted(EntityTypeEnum.VIEWPOINT);

    @dispatch()
    loadViewPoints = entityLoadAction(EntityTypeEnum.VIEWPOINT);

    loadViewPointSucceeded = entityLoadActionSucceeded(EntityTypeEnum.VIEWPOINT);
    
    loadViewPointFailed  = entityLoadActionFailed(EntityTypeEnum.VIEWPOINT);

    @dispatch()
    loadViewPointComments = entityLoadAction(EntityTypeEnum.VIEWPOINTCOMMENT);

    loadViewPointCommentsSucceeded = entityLoadActionSucceeded(
        EntityTypeEnum.VIEWPOINTCOMMENT,EntityActionTypeEnum.VIEWPOINTCOMMENTS);
    
    loadViewPointCommentsFailed  = entityLoadActionFailed(EntityTypeEnum.VIEWPOINTCOMMENT);
}