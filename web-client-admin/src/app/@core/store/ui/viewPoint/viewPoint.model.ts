export enum STORE_UI_VIEWPOINT_KEY {
  searchKey = 'searchKey',
  viewMode = 'viewMode',
  selectedViewPointId = 'selectedViewPointId',
  filterCriteriaIds = 'filterCriteriaIds',
  filteredViewPointIds = 'filteredViewPointIds'
}

export const INIT_UI_VIEWPOINT_STATE = {
  [STORE_UI_VIEWPOINT_KEY.searchKey]: '',
  [STORE_UI_VIEWPOINT_KEY.viewMode]: true,
  [STORE_UI_VIEWPOINT_KEY.selectedViewPointId]: '',
  [STORE_UI_VIEWPOINT_KEY.filterCriteriaIds]: [],
  [STORE_UI_VIEWPOINT_KEY.filteredViewPointIds]: []
};

export interface IViewPointUI {
  searchKey: string;
  viewMode: boolean;
  selectedViewPointId: string;
  filterCriteriaIds: string[];
  filteredViewPointIds: string[];
}
