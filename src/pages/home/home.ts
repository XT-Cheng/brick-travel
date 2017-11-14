import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ViewPointAction } from '../../modules/store/viewPoint/action';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IViewPoint } from '../../modules/store/viewPoint/model';
import { CityAction } from '../../modules/store/city/action';
import { TravelAgendaAction } from '../../modules/store/travelAgenda/action';
import { IAppState } from '../../modules/store/model';
import { ITravelAgenda, IDailyTrip } from '../../modules/store/travelAgenda/model';
import { getTravelAgendas } from '../../modules/store/travelAgenda/selector';
import { getViewPoints } from '../../modules/store/viewPoint/selector';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class HomePage implements AfterViewInit {

  //@select(['entities','viewPoints'])
  //@select(getViewPoints)
  private viewPoints$ : Observable<Array<IViewPoint>>;
  private travelAgendas$ : Observable<Array<ITravelAgenda>>;
  private firstDayTrip$ : Observable<IDailyTrip>;
  
  //@select(['entities','cities'])
  //private cities$ : Observable<Map<string,ICity>>

  constructor(private _store: NgRedux<IAppState>,private _viewPointAction : ViewPointAction,private _cityAction : CityAction,private _travelAgendaAction : TravelAgendaAction) {
    this.viewPoints$ = this._store.select<{ [id : string] : IViewPoint }>(['entities','viewPoints']).map(getViewPoints(this._store));
    this.travelAgendas$ = this._store.select<{ [id : string] : ITravelAgenda }>(['entities','travelAgendas']).map(getTravelAgendas(this._store));
    this.firstDayTrip$ = this.travelAgendas$.map(data => {
      if (data.length> 0) return <IDailyTrip>data[0].dailyTrips[0];
    });
  }

  ngAfterViewInit(): void {
    //this._cityAction.loadCities();
    this._viewPointAction.loadViewPoints();
    this._travelAgendaAction.loadTravelAgendas();
    this.viewPoints$.subscribe(data => {
      console.log('ViewPoint Changed!');
    })
    this.travelAgendas$.subscribe(data => {
      console.log('Agenda Changed!');
    })
  }

  fetchMore() :void {
    //this._cityAction.loadCities(1,50);
    this._viewPointAction.loadViewPoints(1,50);
    //this._travelAgendaAction.loadTravelAgendas();
  }
}
