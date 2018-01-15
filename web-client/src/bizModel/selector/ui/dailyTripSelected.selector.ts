import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../modules/store/store.model';
import { IDailyTripBiz, ITravelAgendaBiz } from '../../model/travelAgenda.biz.model';
import { getTravelAgendas } from '../entity/travelAgenda.selector';

function getSelectedDailyTripId(store: NgRedux<IAppState>): Observable<string> {
    return store.select<string>(['ui', 'travelAgenda', 'selectedDailyTripId']);
}

function getDailyTripById(dailyTripId: string, travelAgendas: ITravelAgendaBiz[]): IDailyTripBiz {
    let found = null;
    travelAgendas.forEach(agenda => {
        agenda.dailyTrips.forEach(dailyTrip => {
            if (dailyTrip._id === dailyTripId) {
                found = dailyTrip;
            }
        })
    })
    return found;
}

export function getSelectedDailyTrip(store: NgRedux<IAppState>): Observable<IDailyTripBiz> {
    return getSelectedDailyTripId(store).combineLatest(getTravelAgendas(store), (v1, v2) => {
        return getDailyTripById(v1, v2);
    });
}