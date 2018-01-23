import { UITravelAgendaActionTypeEnum, UITravelAgendaAction } from './travelAgenda.action';
import { INIT_UI_TRAVELAGENDA_STATE, ITravelAgendaUI } from './travelAgenda.model';
import { asMutable } from 'seamless-immutable';

export function travelAgendaReducer(state = INIT_UI_TRAVELAGENDA_STATE, action: UITravelAgendaAction): ITravelAgendaUI {
    switch (action.type) {
      case UITravelAgendaActionTypeEnum.SELECT_TRAVELADENDA: {
        let nextState = asMutable(state, { deep: true });
        nextState.selectedTravelAgendaId = action.payload.selectedTravelAgendaId;
        nextState.selectedDailyTripId = '';
  
        return nextState;
      }
      case UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP: {
        let nextState = asMutable(state, { deep: true });
        nextState.selectedDailyTripId = action.payload.selectedDailyTripId;
  
        return nextState;
      }
    }
    return state;
  };