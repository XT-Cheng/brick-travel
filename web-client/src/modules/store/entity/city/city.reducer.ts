import { EntityAction, EntityActionTypeEnum } from '../entity.action';
import { ICity } from './city.model';
import { merge } from 'seamless-immutable';

export function cityReducer(state: { [id: string]: ICity } = {}, action: EntityAction): { [id: string]: ICity } {
    switch (action.type) {
        case EntityActionTypeEnum.LOAD: {
            if (action.payload.entities.cities)
                state = merge(state, action.payload.entities.cities);
        }
    }

    return state;
}