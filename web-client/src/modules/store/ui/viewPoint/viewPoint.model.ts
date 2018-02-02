export const INIT_UI_VIEWPOINT_STATE = {
  searchKey: '',
  viewMode: true,
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