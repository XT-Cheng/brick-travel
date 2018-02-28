import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Content, NavController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';

import { IFilterCategoryBiz, IFilterCriteriaBiz } from '../../modules/store/bizModel/filterCategory.biz.model';
import { IViewPointBiz } from '../../modules/store/bizModel/viewPoint.biz.model';
import { AMapComponent } from '../../components/a-map/a-map.component';
import { FilterCategoryService } from '../../modules/store/providers/filterCategory.service';
import { SelectorService } from '../../modules/store/providers/selector.service';
import { TravelAgendaService } from '../../modules/store/providers/travelAgenda.service';
import { ViewPointService } from '../../modules/store/providers/viewPoint.service';
import { ViewPointPage } from '../view-point/view-point.page';

@Component({
  selector: 'page-view-points-list',
  templateUrl: 'view-points-list.page.html',
})
export class ViewPointsListPage implements AfterViewInit, OnDestroy {

  //#region Private member
  @ViewChild(Content) _content: Content;
  @ViewChild(AMapComponent) _aMap: AMapComponent;

  private _stop$ = new Subject();

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
    private _travelAgendaService: TravelAgendaService,
    private _filterCategoryService: FilterCategoryService,
    protected selector: SelectorService) {
    this.displayMode = DisplayModeEnum.Map;
  }
  //#endregion

  //#region Implements interface
  ngAfterViewInit(): void {
    this._travelAgendaService.load();
    this._filterCategoryService.load();

    this._viewPointService.load({ cityId: this.selector.selectedCity.id });
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
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

  protected getSearchIconColor(): string {
    return (this.selector.viewPointSearchKey != '') ? 'red' : '';
  }

  protected getFilterIconColor(): string {
    return (this.selector.isViewPointFiltered) ? 'red' : '';
    
  }

  //#region Private metohds

  //#endregion
}

export enum DisplayModeEnum {
  Map,
  List
}
