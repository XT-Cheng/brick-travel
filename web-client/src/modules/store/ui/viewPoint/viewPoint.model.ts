export const INIT_UI_VIEWPOINT_STATE = {
  searchKey: '',
  selectedViewPointId: '',
  filterCriteriaIds: [],
  filteredViewPointIds: []
}

export interface IViewPointUI {
  searchKey: string,
  selectedViewPointId: string,
  filterCriteriaIds: string[],
  filteredViewPointIds: string[]
}