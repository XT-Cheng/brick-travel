import * as Immutable from 'seamless-immutable';

import { EntityTypeEnum } from '../../entity/entity.model';
import { ICityUI, INIT_UI_CITY_STATE } from '../model/city.model';
import { UIAction, UIActionTypeEnum } from '../ui.action';
import { STORE_UI_COMMON_KEY } from '../ui.model';

export function cityReducer(state = INIT_UI_CITY_STATE, action: UIAction): ICityUI {
    if (!action.payload || action.payload.entityType !== EntityTypeEnum.CITY) { return <any>state; }

    switch (action.type) {
        case UIActionTypeEnum.SELECT: {
            return <any>Immutable(state).set(STORE_UI_COMMON_KEY.selectedId, action.payload.selectedId);
        }
        case UIActionTypeEnum.SEARCH: {
            return <any>Immutable(state).set(STORE_UI_COMMON_KEY.searchKey, action.payload.searchKey);
        }
    }
    return <any>state;
}
