import { EntityAction, EntityActionTypeEnum } from "../entity.action";
import { IViewPointComment, IViewPoint } from "./viewPoint.model";
import { merge } from 'seamless-immutable';

export function viewPointCommentReducer(state: { [id: string]: IViewPointComment } = {}, action: EntityAction): { [id: string]: IViewPointComment } {
   switch (action.type) {
        case EntityActionTypeEnum.LOAD: {
            if (action.payload.entities.viewPointComments)
                state = merge(state,action.payload.entities.viewPointComments);
        }
    }

    return state;
}

export function viewPointReducer(state: { [id: string]: IViewPoint } = {}, action: EntityAction): { [id: string]: IViewPoint } {
   switch (action.type) {
        case EntityActionTypeEnum.LOAD: {
            if (action.payload.entities.viewPoints)
                state = merge(state,action.payload.entities.viewPoints);
        }
    }

    return state;
}