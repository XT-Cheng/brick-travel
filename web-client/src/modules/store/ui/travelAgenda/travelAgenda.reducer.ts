import { UITravelAgendaActionTypeEnum, UITravelAgendaAction } from './travelAgenda.action';
import { INIT_UI_TRAVELAGENDA_STATE, ITravelAgendaUI } from './travelAgenda.model';
import * as Immutable from 'seamless-immutable';

export function travelAgendaReducer(state = INIT_UI_TRAVELAGENDA_STATE, action: UITravelAgendaAction): ITravelAgendaUI {
    switch (action.type) {
      case UITravelAgendaActionTypeEnum.SELECT_TRAVELADENDA: {
        return Immutable(state).set('selectedTravelAgendaId',action.payload.selectedTravelAgendaId);
      }
      case UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP: {
        return Immutable(state).set('selectedDailyTripId',action.payload.selectedDailyTripId);
      }
    }
    return state;
  };