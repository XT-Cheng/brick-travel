import { NgRedux } from '@angular-redux/store';
import { denormalize } from 'normalizr';
import { Observable } from 'rxjs/Rx';
import * as Immutable from 'seamless-immutable';

import { ICity } from '../../../modules/store/entity/city/city.model';
import { city } from '../../../modules/store/entity/entity.schema';
import { IAppState } from '../../../modules/store/store.model';
import { ICityBiz } from '../../model/city.biz.model';

export function getCities(store : NgRedux<IAppState>) : Observable<ICityBiz[]> {
    return store.select<{ [id: string]: ICity }>(['entities', 'cities'])
    .map(getCitiesInternal(store));
}

function getCitiesInternal(store : NgRedux<IAppState>) {
    return (data : { [id : string] : ICity }) : ICityBiz[] => {
        return denormalize(Object.keys(data),[ city ],Immutable(store.getState().entities).asMutable({deep: true}));
    }
}