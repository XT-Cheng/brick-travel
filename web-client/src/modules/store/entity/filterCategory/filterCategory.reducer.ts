import { EntityAction, EntityActionTypeEnum } from "../entity.action";
import { IFilterCategory, IFilterCriteria } from "./filterCategory.model";

export function filterCategoryReducer(state: { [id: string]: IFilterCategory } = {}, action: EntityAction): { [id: string]: IFilterCategory } {
    // switch (action.type) {
    //     case EntityActionTypeEnum.LOAD: {
    //         if (action.payload.entities.filterCategories)
    //             state = merge(state, action.payload.entities.filterCategories);
    //     }
    // }

    return state;
}

export function filterCriteriaReducer(state: { [id: string]: IFilterCriteria } = {}, action: EntityAction): { [id: string]: IFilterCriteria } {
    // switch (action.type) {
    //     case EntityActionTypeEnum.LOAD: {
    //         if (action.payload.entities.filterCriteries)
    //             state = merge(state, action.payload.entities.filterCriteries);
    //     }
    // }

    return state;
}