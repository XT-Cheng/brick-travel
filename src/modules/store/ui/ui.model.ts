export const INIT_UI_STATE = {
  viewPoint: {
    searchKey: '',
    filters: []
  }
}

export interface IViewPointUI {
  searchKey: string,
  filters: string[]
}

export interface IUIState {
  viewPoint: IViewPointUI
}