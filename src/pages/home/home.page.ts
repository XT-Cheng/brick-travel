import { NgRedux } from '@angular-redux/store';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { FabContainer } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { asMutable } from 'seamless-immutable';

import { CityActionGenerator } from '../../modules/store/entity/city/city.action';
import { FilterCategoryActionGenerator } from '../../modules/store/entity/filterCategory/filterCategory.action';
import { getFilterCategories } from '../../bizModel/selector/entity/filterCategory.selector';
import { TravelAgendaActionGenerator } from '../../modules/store/entity/travelAgenda/travelAgenda.action';
import { getTravelAgendas } from '../../bizModel/selector/entity/travelAgenda.selector';
import { ViewPointActionGenerator } from '../../modules/store/entity/viewPoint/viewPoint.action';
import { getViewPoints } from '../../bizModel/selector/entity/viewPoint.selector';
import { IAppState } from '../../modules/store/store.model';
import { UIActionGenerator } from '../../modules/store/ui/ui.action';
import { IDailyTripBiz, ITravelAgendaBiz } from '../../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { IFilterCategoryBiz } from '../../bizModel/model/filterCategory.biz.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements AfterViewInit {
  // @ViewChild(ViewPointSearchComponent) private searchBar: ViewPointSearchComponent;
  // @ViewChild(ViewPointFilterComponent) private filterBar: ViewPointFilterComponent;
  
  //@select(['entities','viewPoints'])
  //@select(getViewPoints)
  protected viewPoints$: Observable<Array<IViewPointBiz>>;
  protected travelAgendas$: Observable<Array<ITravelAgendaBiz>>;
  protected filterCategories$: Observable<Array<IFilterCategoryBiz>>;

  protected search$ : Observable<string>;

  protected dayTripSelected$: Subject<IDailyTripBiz> = new Subject<IDailyTripBiz>();

  protected showSearchBar : boolean = false;
  protected showFilterBar : boolean = false;
  public displayModeEnum = DisplayModeEnum;

  //@select(['entities','cities'])
  //private cities$ : Observable<Map<string,ICity>>
  private dailyTrips: Array<IDailyTripBiz> = new Array<IDailyTripBiz>();
  private firstDailyTrip: boolean = true;
  protected displayMode : DisplayModeEnum;

  constructor(private _store: NgRedux<IAppState>,
    private _uiActionGeneration : UIActionGenerator,
    private _viewPointActionGenerator: ViewPointActionGenerator, private _cityActionUIActionGenerator: CityActionGenerator,
    private _travelAgendaActionUIActionGenerator: TravelAgendaActionGenerator, private _filterCategoryActionUIActionGenerator: FilterCategoryActionGenerator) {
    this.viewPoints$ = this._store.select<{ [id: string]: IViewPointBiz }>(['entities', 'viewPoints'])
        .map(getViewPoints(this._store));
    this.travelAgendas$ = this._store.select<{ [id: string]: ITravelAgendaBiz }>(['entities', 'travelAgendas'])
        .map(getTravelAgendas(this._store));
    this.filterCategories$ = this._store.select<{ [id: string]: IFilterCategoryBiz }>(['entities', 'filterCategories'])
        .map(getFilterCategories(this._store));
    this.search$ = this._store.select<string>(['ui','viewPoint','searchKey']);

    this.displayMode = DisplayModeEnum.Map;
  }

  ngAfterViewInit(): void {
    this._cityActionUIActionGenerator.loadCities();
    this._viewPointActionGenerator.loadViewPoints();
    this._travelAgendaActionUIActionGenerator.loadTravelAgendas();
    this._filterCategoryActionUIActionGenerator.loadFilterCategories();
    
    this.viewPoints$.subscribe(data => {
      console.log('ViewPoint Changed!');
    })
    this.travelAgendas$.subscribe(data => {
      console.log('Agenda Changed!');
      if (data.length>0) {
        this._uiActionGeneration.selectTravelAgenda("1");
        this.dailyTrips = this.getDailyTrips();
      }
      // if ( this.dailyTrips.length>0)
      //   this.dayTripSelected$.next(this.dailyTrips[0]);
    })
    this.search$.subscribe(searchKey => {
      console.log(searchKey);
    })
  }

  dismissSearchBar() : void {
    this.showSearchBar = false;
  }
  
  displaySearchBar(fab : FabContainer) : void {
    this.showSearchBar = true;
    fab.close();
  }

  dismissFilterBar() : void {
    this.showFilterBar = false;
  }
  
  displayFilterBar(fab : FabContainer) : void {
    this.showFilterBar = true;
    fab.close();
  }
  
  fetchMore(): void {
    //this._cityAction.loadCities(1,50);
    this._viewPointActionGenerator.loadViewPoints(1, 50);
    //this._travelAgendaAction.loadTravelAgendas();
  }

  changeDailyTrip(): void {
    this.dayTripSelected$.next(this.dailyTrips[this.firstDailyTrip ? 1 : 0]);
    this.firstDailyTrip = !this.firstDailyTrip;
  }

  clearDailyTrip(): void {
    this.dayTripSelected$.next(null);
  }

  getDailyTrips(): Array<IDailyTripBiz> {
    let ret = new Array<IDailyTripBiz>();
    let viewPoints = asMutable(this._store.getState().entities.viewPoints, { deep: true });
    let dailyTrips = asMutable(this._store.getState().entities.dailyTrips, { deep: true });
    let travelViewPoints = asMutable(this._store.getState().entities.travelViewPoints, { deep: true });

    Object.keys(dailyTrips).forEach(key => {
      let dailyTrip = dailyTrips[key];
      dailyTrip.travelViewPoints = dailyTrip.travelViewPoints.map(id => travelViewPoints[id]);
      Object.keys(dailyTrip.travelViewPoints).forEach(key => {
        let travelViewPoint = dailyTrip.travelViewPoints[key];
        travelViewPoint.viewPoint = viewPoints[travelViewPoint.viewPoint];
      });
      ret.push(dailyTrip);
    });

    return ret;
  }

  protected searchViewPoint(searchKey :string) {
    this._uiActionGeneration.searchViewPoint(searchKey);
  }

  protected switchDisplayMode() {
    if (this.displayMode === DisplayModeEnum.List)
      this.displayMode = DisplayModeEnum.Map;
    else
      this.displayMode = DisplayModeEnum.List;
  }

  protected getSwitchButtonClass() {
    return {
      'map': this.displayMode === DisplayModeEnum.Map,
      'list': this.displayMode === DisplayModeEnum.List
    }
  }

  protected getStyle(expect) {
    return {
      'display': this.displayMode === expect? 'inline':'none'
    }
  }
}

export enum DisplayModeEnum {
  Map,
  List,
  Agenda
}
