import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../modules/store/store.model';
import { ITravelAgendaBiz } from '../../model/travelAgenda.biz.model';
import { getTravelAgendas } from '../entity/travelAgenda.selector';

function getSelectedAgendaId(store : NgRedux<IAppState>) : Observable<string> {
   return store.select<string>(['ui', 'travelAgenda', 'selectedTravelAgendaId']);
}

function getTravelAgendaById(agendaId: string, agendas: ITravelAgendaBiz[]) {
    return agendas.find(agenda => agenda._id === agendaId);
}

export function getSelectedTravelAgenda(store : NgRedux<IAppState>) : Observable<ITravelAgendaBiz> {
    return getSelectedAgendaId(store).combineLatest(getTravelAgendas(store),(v1,v2) => {
        return getTravelAgendaById(v1,v2);
      });
}