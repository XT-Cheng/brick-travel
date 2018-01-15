import { NgRedux } from '@angular-redux/store/lib/src/components/ng-redux';
import { Observable } from 'rxjs/Rx';

import { IAppState } from '../../../modules/store/store.model';
import { ICityBiz } from '../../model/city.biz.model';
import { getCities } from '../entity/city.selector';

function getSelectedCityId(store: NgRedux<IAppState>): Observable<string> {
    return store.select<string>(['ui', 'city', 'selectedCityId']);
}

function getCityById(cityId: string, cities: ICityBiz[]): ICityBiz {
    let found = null;
    cities.forEach(city => {
            if (city._id === cityId) {
                found = city;
        }
    })
    return found;
}

export function getSelectedCity(store: NgRedux<IAppState>): Observable<ICityBiz> {
    return getSelectedCityId(store).combineLatest(getCities(store), (v1, v2) => {
        return getCityById(v1, v2);
    });
}