import { NgRedux } from '@angular-redux/store';
import { asMutable } from 'seamless-immutable';
import { IAppState } from '../../../modules/store/store.model';
import { ITravelAgendaBiz } from '../../model/travelAgenda.biz.model';

export function getSelectedTravelAgenda(store: NgRedux<IAppState>) {
    return (agendaId: string): ITravelAgendaBiz => {
        let viewPoints = asMutable(store.getState().entities.viewPoints, { deep: true });
        let travelAgendas = asMutable(store.getState().entities.travelAgendas, { deep: true });
        let dailyTrips = asMutable(store.getState().entities.dailyTrips, { deep: true });
        let travelViewPoints = asMutable(store.getState().entities.travelViewPoints, { deep: true });

        let agenda = travelAgendas[agendaId];
        if (!agenda) return null;

        agenda.dailyTrips = agenda.dailyTrips.map(id => dailyTrips[id]);
        Object.keys(agenda.dailyTrips).forEach(key => {
            let dailyTrip = agenda.dailyTrips[key];
            dailyTrip.travelViewPoints = dailyTrip.travelViewPoints.map(id => travelViewPoints[id]);
            Object.keys(dailyTrip.travelViewPoints).forEach(key => {
                let travelViewPoint = dailyTrip.travelViewPoints[key];
                travelViewPoint.viewPoint = viewPoints[travelViewPoint.viewPoint];
            });
        });
        return agenda;
    }
}