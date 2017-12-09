import { NgRedux } from '@angular-redux/store/lib/src/components/ng-redux';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Content, FabContainer, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { IFilterCategoryBiz, IFilterCriteriaBiz } from '../../bizModel/model/filterCategory.biz.model';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { getViewPoints } from '../../bizModel/selector/entity/viewPoint.selector';
import { getCurrentFilters } from '../../bizModel/selector/ui/viewPointFilter.selector';
import { getViewPointSearch } from '../../bizModel/selector/ui/viewPointSearch.selector';
import { getSelectedViewPoint } from '../../bizModel/selector/ui/viewPointSelected.selector';
import { CityActionGenerator } from '../../modules/store/entity/city/city.action';
import { FilterCategoryActionGenerator } from '../../modules/store/entity/filterCategory/filterCategory.action';
import { TravelAgendaActionGenerator } from '../../modules/store/entity/travelAgenda/travelAgenda.action';
import { ViewPointActionGenerator } from '../../modules/store/entity/viewPoint/viewPoint.action';
import { IAppState } from '../../modules/store/store.model';
import { UIActionGenerator } from '../../modules/store/ui/ui.action';
import { ViewPointPage } from '../view-point/view-point.page';
import { AMapComponent } from '../../components/a-map/a-map.component';
import { IDailyTripBiz } from '../../bizModel/model/travelAgenda.biz.model';
import { getViewMode } from '../../bizModel/selector/ui/viewModeSelector';
import { getSelectedDailyTrip } from '../../bizModel/selector/ui/dailyTripSelected.selector';

@Component({
  selector: 'page-view-points-select',
  templateUrl: 'view-points-select.page.html',
})
export class ViewPointsSelectPage implements AfterViewInit {
  //#region Private member
  @ViewChild(Content) _content : Content;
  @ViewChild(AMapComponent) _aMap : AMapComponent;
  //#endregion

  //#region Protected member
  
  protected viewPoints$: Observable<Array<IViewPointBiz>>;
  protected selectedViewPoint$: Observable<IViewPointBiz>;
  protected viewMode$: Observable<boolean>;
  protected selectedDailyTrip$: Observable<IDailyTripBiz>;
  protected currentSearch$: Observable<string>;
  protected currentFilterCategories$: Observable<Array<IFilterCategoryBiz>>;

  protected displayModeEnum = DisplayModeEnum;
  protected displayMode: DisplayModeEnum;

  protected showSearchBar: boolean = false;
  protected showFilterBar: boolean = false;
  //#endregion

  //#region Constructor
  constructor(private _nav: NavController,
    private _store: NgRedux<IAppState>,
    private _uiActionGeneration: UIActionGenerator,
    private _viewPointActionGenerator: ViewPointActionGenerator,
    private _cityActionGenerator: CityActionGenerator,
    private _travelAgendaActionGenerator: TravelAgendaActionGenerator,
    private _filterCategoryActionGenerator: FilterCategoryActionGenerator) {
    this.displayMode = DisplayModeEnum.Map;

    this.viewPoints$ = getViewPoints(this._store);
    this.selectedViewPoint$ = getSelectedViewPoint(this._store);
    this.viewMode$ = getViewMode(this._store);
    this.selectedDailyTrip$ = getSelectedDailyTrip(this._store);
    this.currentFilterCategories$ = getCurrentFilters(this._store);
    this.currentSearch$ = getViewPointSearch(this._store);
  }
  //#endregion

  //#region Implements interface
  ngAfterViewInit(): void {
    this._cityActionGenerator.loadCities();
    this._viewPointActionGenerator.loadViewPoints();
    this._travelAgendaActionGenerator.loadTravelAgendas();
    this._filterCategoryActionGenerator.loadFilterCategories();
  }
  //#endregion

  //#region Protected method
  protected searchViewPoint(searchKey: string) {
    this._uiActionGeneration.searchViewPoint(searchKey);
  }

  protected criteriaClicked(filterChanged: { category: IFilterCategoryBiz, criteria: IFilterCriteriaBiz }) {
    filterChanged.criteria.isChecked = !filterChanged.criteria.isChecked;

    if (!filterChanged.category.criteries.find(c => !c.isChecked)) {
      filterChanged.category.criteries.forEach(c => {
        c.isChecked = false;
      })
    }

    let checkId: string = null;
    let unCheckIds: Array<string> = new Array<string>();

    filterChanged.category.criteries.forEach(c => {
      if (c.isChecked)
        checkId = c.id;
      else
        unCheckIds.push(c.id);
    });

    this._uiActionGeneration.selectCriteria(checkId, unCheckIds);
  }

  dismissSearchBar(): void {
    this.showSearchBar = false;
  }

  displaySearchBar(fab: FabContainer): void {
    this.showSearchBar = true;
    fab.close();
  }

  dismissFilterBar(): void {
    this.showFilterBar = false;
  }

  displayFilterBar(fab: FabContainer): void {
    this.showFilterBar = true;
    fab.close();
  }

  protected getStyle(expect) {
    return {
      'display': this.displayMode === expect ? 'inline' : 'none'
    }
  }

  protected switchDisplayMode() {
    if (this.displayMode === DisplayModeEnum.Map)
      this.displayMode = DisplayModeEnum.List;
    else {
      this.displayMode = DisplayModeEnum.Map;
      setTimeout(() => this._aMap.setFitView());
    }
  }

  protected viewPointClicked(viewPoint : IViewPointBiz) {
    this._uiActionGeneration.selectViewPoint(viewPoint);
    this._nav.push(ViewPointPage);
  }

  protected getIconName() :string {
    return (this.displayMode === DisplayModeEnum.Map) ? 'list':'map'; 
  }

  //#region Private metohds

  //#endregion
}

export enum DisplayModeEnum {
  Map,
  List
}
