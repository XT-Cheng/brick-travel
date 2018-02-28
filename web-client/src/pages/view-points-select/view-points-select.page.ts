import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Content, NavController } from 'ionic-angular';

import { IFilterCategoryBiz, IFilterCriteriaBiz } from '../../modules/store/bizModel/filterCategory.biz.model';
import { IDailyTripBiz, ITravelAgendaBiz, ITravelViewPointBiz } from '../../modules/store/bizModel/travelAgenda.biz.model';
import { IViewPointBiz } from '../../modules/store/bizModel/viewPoint.biz.model';
import { AMapComponent } from '../../components/a-map/a-map.component';
import { CityService } from '../../modules/store/providers/city.service';
import { FilterCategoryService } from '../../modules/store/providers/filterCategory.service';
import { SelectorService } from '../../modules/store/providers/selector.service';
import { TravelAgendaService } from '../../modules/store/providers/travelAgenda.service';
import { ViewPointService } from '../../modules/store/providers/viewPoint.service';
import { ViewPointPage } from '../view-point/view-point.page';

@Component({
  selector: 'page-view-points-select',
  templateUrl: 'view-points-select.page.html',
})
export class ViewPointsSelectPage implements AfterViewInit {
  //#region Private member
  @ViewChild(Content) _content: Content;
  @ViewChild(AMapComponent) _aMap: AMapComponent;
  //#endregion

  //#region Protected member

  protected displayModeEnum = DisplayModeEnum;
  protected displayMode: DisplayModeEnum;

  protected showSearchBar: boolean = false;
  protected showFilterBar: boolean = false;
  //#endregion

  //#region Constructor
  constructor(private _nav: NavController,
    private _viewPointService: ViewPointService,
    private _cityService: CityService,
    private _travelAgendaService: TravelAgendaService,
    private _filterCategoryService: FilterCategoryService,
    protected selector : SelectorService,) {
    this.displayMode = DisplayModeEnum.Map;
  }
  //#endregion

  //#region Implements interface
  ngAfterViewInit(): void {
    this._cityService.load();
    this._viewPointService.load({cityId: this.selector.selectedCity.id});
    this._travelAgendaService.load();
    this._filterCategoryService.load();
  }
  //#endregion

  //#region Protected method
  protected searchViewPoint(searchKey: string) {
    this._viewPointService.search(searchKey);
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

    this._viewPointService.selectCriteria(checkId, unCheckIds);
  }

  dismissSearchBar(): void {
    this.showSearchBar = false;
  }

  displaySearchBar(): void {
    this.showSearchBar = true;
  }

  dismissFilterBar(): void {
    this.showFilterBar = false;
  }

  displayFilterBar(): void {
    this.showFilterBar = true;
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

  protected viewPointClicked(viewPoint: IViewPointBiz) {
    this._viewPointService.selectViewPoint(viewPoint);
    this._nav.push(ViewPointPage);
  }

  protected getDisplayModeIcon(): string {
    return (this.displayMode === DisplayModeEnum.Map) ? 'list' : 'map';
  }

  protected viewPointAdded(value: { dailyTrip: IDailyTripBiz, added: IViewPointBiz }) {
    this._travelAgendaService.addTravelViewPoint(value.added,value.dailyTrip);
  }

  protected getSearchIconColor(): string {
    return (this.selector.viewPointSearchKey != '') ? 'red' : '';
  }

  protected getFilterIconColor(): string {
    return (this.selector.isViewPointFiltered) ? 'red' : '';
    
  }

  protected viewPointRemoved(value: { dailyTrip: IDailyTripBiz, travelAgenda: ITravelAgendaBiz, removed: ITravelViewPointBiz }) {
    // let dailyTrip = value.dailyTrip;
    // let travelAgenda = value.travelAgenda;
    // let travelViewPoint = value.removed;

    // this._travelAgendaActionGenerator.deleteTravelViewPoint(travelViewPoint.id, translateTravelViewPointFromBiz(travelViewPoint));
    
    // dailyTrip.travelViewPoints.forEach(tvp => {
    //   this._travelAgendaActionGenerator.updateTravelViewPoint(tvp.id,translateTravelViewPointFromBiz(tvp));
    // })
    
    // this._travelAgendaActionGenerator.updateDailyTrip(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));
    // this._travelAgendaActionGenerator.updateTravelAgenda(travelAgenda.id, translateTravelAgendaFromBiz(travelAgenda));
  }

  //#region Private metohds

  //#endregion
}

export enum DisplayModeEnum {
  Map,
  List
}
