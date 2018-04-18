export enum STORE_UI_TRAVELAGENDA_KEY {
  selectedTravelAgendaId = 'selectedTravelAgendaId',
  selectedDailyTripId = 'selectedDailyTripId',
  selectedTravelViewPointId = 'selectedTravelViewPointId'
}

export const INIT_UI_TRAVELAGENDA_STATE = {
  [STORE_UI_TRAVELAGENDA_KEY.selectedTravelAgendaId]: '',
  [STORE_UI_TRAVELAGENDA_KEY.selectedDailyTripId]: '',
  [STORE_UI_TRAVELAGENDA_KEY.selectedTravelViewPointId]: ''
};

export interface ITravelAgendaUI {
  selectedTravelAgendaId: string;
  selectedDailyTripId: string;
  selectedTravelViewPointId: string;
}
