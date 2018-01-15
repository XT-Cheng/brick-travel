import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Rx';
import { asMutable } from 'seamless-immutable';

import { ICity } from '../../../modules/store/entity/city/city.model';
import { IAppState } from '../../../modules/store/store.model';
import { ICityBiz } from '../../model/city.biz.model';

export function getCities(store : NgRedux<IAppState>) : Observable<ICityBiz[]> {
    return store.select<{ [id: string]: ICity }>(['entities', 'cities'])
    .map(getCitiesInternal(store));
}

function getCitiesInternal(store : NgRedux<IAppState>) {
    return (data : { [_id : string] : ICity }) : ICityBiz[] => {
        let ret = new Array<ICityBiz>();
        let cities = asMutable(data,{deep: true});
        Object.keys(cities).forEach(key => {
            let city = cities[key];
            ret.push(city);
        });
        
        return ret;
    }
}