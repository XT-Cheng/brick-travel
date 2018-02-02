export enum STORE_UI_TRAVELAGENDA_KEY {
  selectedTravelAgendaId = 'selectedTravelAgendaId',
  selectedDailyTripId = 'selectedDailyTripId'
}

export const INIT_UI_TRAVELAGENDA_STATE = {
  [STORE_UI_TRAVELAGENDA_KEY.selectedTravelAgendaId]: '',
  [STORE_UI_TRAVELAGENDA_KEY.selectedDailyTripId]: ''
}

export interface ITravelAgendaUI {
  selectedTravelAgendaId: string,
  selectedDailyTripId: string,
}