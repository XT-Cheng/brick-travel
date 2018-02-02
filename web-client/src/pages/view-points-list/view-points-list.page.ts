import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Content, FabContainer, NavController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';

import { IFilterCategoryBiz, IFilterCriteriaBiz } from '../../bizModel/model/filterCategory.biz.model';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { AMapComponent } from '../../components/a-map/a-map.component';
import { FilterCategoryService } from '../../providers/filterCategory.service';
import { SelectorService } from '../../providers/selector.service';
import { TravelAgendaService } from '../../providers/travelAgenda.service';
import { ViewPointService } from '../../providers/viewPoint.service';
import { ViewPointPage } from '../view-point/view-point.page';

@Component({
  selector: 'page-view-points-list',
  templateUrl: 'view-points-list.page.html',
})
export class ViewPointsListPage implements AfterViewInit, OnDestroy {

  //#region Private member
  @ViewChild(Content) _content : Content;
  @ViewChild(AMapComponent) _aMap : AMapComponent;
  
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
    protected selector : SelectorService) {
    this.displayMode = DisplayModeEnum.Map;
  }
  //#endregion

  //#region Implements interface
  ngAfterViewInit(): void {
    this._travelAgendaService.load();
    this._filterCategoryService.load();
    
    this.selector.selectedCity$.takeUntil(this._stop$).subscribe(city => {
      this._viewPointService.load({cityId: city.id});
    });
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
    this._viewPointService.select(viewPoint);
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
