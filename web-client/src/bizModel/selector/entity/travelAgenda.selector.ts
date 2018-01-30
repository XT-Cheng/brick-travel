import { NgRedux } from '@angular-redux/store';
import { denormalize } from 'normalizr';
import { Observable } from 'rxjs/Observable';
import * as Immutable from 'seamless-immutable';

import { travelAgenda } from '../../../modules/store/entity/entity.schema';
import { ITravelAgenda } from '../../../modules/store/entity/travelAgenda/travelAgenda.model';
import { IAppState } from '../../../modules/store/store.model';
import { caculateDistance, ITravelAgendaBiz } from '../../model/travelAgenda.biz.model';

export function getTravelAgendas(store : NgRedux<IAppState>) : Observable<ITravelAgendaBiz[]> {
    return store.select<{ [id: string]: ITravelAgenda }>(['entities', 'travelAgendas'])
    .map(getTravelAgendasInternal(store));
}

function getTravelAgendasInternal(store : NgRedux<IAppState>) {
    return (data : { [id : string] : ITravelAgenda }) : Array<ITravelAgendaBiz> => {
        let ret = denormalize(Object.keys(data),[ travelAgenda ],Immutable(store.getState().entities).asMutable({deep: true}));

        ret.forEach(ta => {
            ta.dailyTrips.forEach(dt => {
                caculateDistance(dt);
            })
        })
        
        return ret;
    }
}