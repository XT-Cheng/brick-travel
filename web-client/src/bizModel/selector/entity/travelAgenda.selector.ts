import { NgRedux } from '@angular-redux/store';
import { asMutable } from 'seamless-immutable';
import { IAppState } from '../../../modules/store/store.model';
import { ITravelAgendaBiz, caculateDistance } from '../../model/travelAgenda.biz.model';
import { Observable } from 'rxjs/Observable';
import { ITravelAgenda } from '../../../modules/store/entity/travelAgenda/travelAgenda.model';

export function getTravelAgendas(store : NgRedux<IAppState>) : Observable<ITravelAgendaBiz[]> {
    return store.select<{ [id: string]: ITravelAgenda }>(['entities', 'travelAgendas'])
    .map(getTravelAgendasInternal(store));
}

function getTravelAgendasInternal(store : NgRedux<IAppState>) {
    return (data : { [id : string] : ITravelAgenda }) : Array<ITravelAgendaBiz> => {
        let ret = new Array<ITravelAgendaBiz>();
        let viewPoints = asMutable(store.getState().entities.viewPoints,{deep: true});
        let dailyTrips = asMutable(store.getState().entities.dailyTrips,{deep: true});
        let travelViewPoints = asMutable(store.getState().entities.travelViewPoints,{deep: true});
        let agendas = asMutable(data,{deep: true});

        Object.keys(agendas).forEach(key => {
            let agenda = agendas[key];
            agenda.dailyTrips = agenda.dailyTrips.map(id => dailyTrips[id]);
            Object.keys(agenda.dailyTrips).forEach(key => {
                let dailyTrip = agenda.dailyTrips[key];
                dailyTrip.travelViewPoints = dailyTrip.travelViewPoints.map(_id => travelViewPoints[_id]);
                Object.keys(dailyTrip.travelViewPoints).forEach(key => {
                    let travelViewPoint = dailyTrip.travelViewPoints[key];
                    travelViewPoint.viewPoint = viewPoints[travelViewPoint.viewPoint];
                });

                caculateDistance(dailyTrip);
            });
            ret.push(agenda);
        });
        
        return ret;
    }
}