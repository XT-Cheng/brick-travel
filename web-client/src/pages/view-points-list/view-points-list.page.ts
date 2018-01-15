import { NgRedux } from '@angular-redux/store/lib/src/components/ng-redux';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Content, FabContainer, NavController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs/Rx';

import { ICityBiz } from '../../bizModel/model/city.biz.model';
import { IFilterCategoryBiz, IFilterCriteriaBiz } from '../../bizModel/model/filterCategory.biz.model';
import { IDailyTripBiz } from '../../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { getSelectedCity } from '../../bizModel/selector/ui/citySelected.selector';
import { getSelectedDailyTrip } from '../../bizModel/selector/ui/dailyTripSelected.selector';
import { getViewMode } from '../../bizModel/selector/ui/viewModeSelected.selector';
import { getCurrentFilters, getFilteredViewPoints } from '../../bizModel/selector/ui/viewPointFilter.selector';
import { getViewPointSearch } from '../../bizModel/selector/ui/viewPointSearch.selector';
import { getSelectedViewPoint } from '../../bizModel/selector/ui/viewPointSelected.selector';
import { AMapComponent } from '../../components/a-map/a-map.component';
import { FilterCategoryActionGenerator } from '../../modules/store/entity/filterCategory/filterCategory.action';
import { TravelAgendaActionGenerator } from '../../modules/store/entity/travelAgenda/travelAgenda.action';
import { ViewPointActionGenerator } from '../../modules/store/entity/viewPoint/viewPoint.action';
import { IAppState } from '../../modules/store/store.model';
import { UIActionGenerator } from '../../modules/store/ui/ui.action';
import { ViewPointPage } from '../view-point/view-point.page';

@Component({
  selector: 'page-view-points-list',
  templateUrl: 'view-points-list.page.html',
})
export class ViewPointsListPage implements AfterViewInit, OnDestroy {

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
  protected selectedCity$ : Observable<ICityBiz>;
  
  protected subscriptions : Array<Subscription>;

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
    private _travelAgendaActionGenerator: TravelAgendaActionGenerator,
    private _filterCategoryActionGenerator: FilterCategoryActionGenerator) {
    this.displayMode = DisplayModeEnum.Map;

    this.viewPoints$ = getFilteredViewPoints(this._store);
    this.selectedViewPoint$ = getSelectedViewPoint(this._store);
    this.viewMode$ = getViewMode(this._store);
    this.selectedDailyTrip$ = getSelectedDailyTrip(this._store);
    this.currentFilterCategories$ = getCurrentFilters(this._store);
    this.selectedCity$ =  getSelectedCity(this._store);
    this.currentSearch$ = getViewPointSearch(this._store);

    this.subscriptions = new Array<Subscription>();
  }
  //#endregion

  //#region Implements interface
  ngAfterViewInit(): void {
    //this._viewPointActionGenerator.loadViewPoints();
    this._travelAgendaActionGenerator.loadTravelAgendas();
    this._filterCategoryActionGenerator.loadFilterCategories();

    this.subscriptions.push(this.selectedCity$.subscribe(city => {
      this._viewPointActionGenerator.loadViewPoints({cityId: city._id});
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
        checkId = c._id;
      else
        unCheckIds.push(c._id);
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
