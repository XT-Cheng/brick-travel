export const INIT_UI_VIEWPOINT_STATE = {
  searchKey: '',
  selectedViewPointId: '',
  filters: []
}

export interface IViewPointUI {
  searchKey: string,
  selectedViewPointId: string,
  filters: string[]
}