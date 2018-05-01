export enum STORE_UI_TRAVELAGENDA_KEY {
  selectedDailyTripId = 'selectedDailyTripId',
  selectedTravelViewPointId = 'selectedTravelViewPointId'
}

export const INIT_UI_TRAVELAGENDA_STATE: ITravelAgendaUI = {
  searchKey: '',
  selectedId: '',
  selectedDailyTripId: '',
  selectedTravelViewPointId: ''
};

export interface ITravelAgendaUI {
  selectedId: string;
  searchKey: string;
  selectedDailyTripId: string;
  selectedTravelViewPointId: string;
}
