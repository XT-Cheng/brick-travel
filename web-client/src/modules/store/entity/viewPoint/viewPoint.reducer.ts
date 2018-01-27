import { EntityAction, EntityActionTypeEnum, EntityActionPhaseEnum } from "../entity.action";
import { IViewPointComment, IViewPoint } from "./viewPoint.model";
import { merge,setIn } from 'seamless-immutable';

export function viewPointCommentReducer(state: { [id: string]: IViewPointComment } = {}, action: EntityAction): { [id: string]: IViewPointComment } {
    switch (action.type) {
        case EntityActionTypeEnum.LOAD:
        case EntityActionTypeEnum.VIEWPOINTCOMMENTS: {
            if (action.meta.phaseType == EntityActionPhaseEnum.SUCCEED && action.payload.entities.viewPointComments)
                state = merge(state, action.payload.entities.viewPointComments);
            break;
        }
    }

    return state;
}

export function viewPointReducer(state: { [id: string]: IViewPoint } = {}, action: EntityAction): { [id: string]: IViewPoint } {
    switch (action.type) {
        case EntityActionTypeEnum.LOAD: {
            if (action.meta.phaseType == EntityActionPhaseEnum.SUCCEED && action.payload.entities.viewPoints)
                state = merge(state, action.payload.entities.viewPoints);
            break;
        }
        case EntityActionTypeEnum.VIEWPOINTCOMMENTS: {
            if (action.meta.phaseType == EntityActionPhaseEnum.SUCCEED && action.payload.entities.viewPoints) {
                let key = Object.keys(action.payload.entities.viewPoints)[0];
                let viewPoint = state[key];
                let comments = viewPoint.comments.concat(Object.keys(action.payload.entities.viewPointComments));

                state = setIn(state, [key, "comments"], comments);
            }
            break;
        }
    }

    return state;
}