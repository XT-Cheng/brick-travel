import { NgRedux } from '@angular-redux/store';
import * as Immutable from 'seamless-immutable';
import { IAppState } from '../../../modules/store/store.model';
import { ITravelAgendaBiz, caculateDistance } from '../../model/travelAgenda.biz.model';
import { Observable } from 'rxjs/Observable';
import { ITravelAgenda } from '../../../modules/store/entity/travelAgenda/travelAgenda.model';
import { travelAgenda } from '../../../modules/store/entity/entity.schema';
import { denormalize } from 'normalizr';

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