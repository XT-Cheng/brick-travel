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
import { Subject } from 'rxjs/Subject';
import { asMutable } from 'seamless-immutable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements AfterViewInit {

  //@select(['entities','viewPoints'])
  //@select(getViewPoints)
  protected viewPoints$: Observable<Array<IViewPoint>>;
  protected travelAgendas$: Observable<Array<ITravelAgenda>>;
  protected dayTripSelected$: Subject<IDailyTrip> = new Subject<IDailyTrip>();

  //@select(['entities','cities'])
  //private cities$ : Observable<Map<string,ICity>>
  private dailyTrips : Array<IDailyTrip> = new Array<IDailyTrip>();
  private firstDailyTrip : boolean = true;

  constructor(private _store: NgRedux<IAppState>, private _viewPointAction: ViewPointAction, private _cityAction: CityAction, private _travelAgendaAction: TravelAgendaAction) {
    this.viewPoints$ = this._store.select<{ [id: string]: IViewPoint }>(['entities', 'viewPoints']).map(getViewPoints(this._store));
    this.travelAgendas$ = this._store.select<{ [id: string]: ITravelAgenda }>(['entities', 'travelAgendas']).map(getTravelAgendas(this._store));
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
      this.dailyTrips = this.getDailyTrips();
      // if ( this.dailyTrips.length>0)
      //   this.dayTripSelected$.next(this.dailyTrips[0]);
    })
  }

  fetchMore(): void {
    //this._cityAction.loadCities(1,50);
    this._viewPointAction.loadViewPoints(1, 50);
    //this._travelAgendaAction.loadTravelAgendas();
  }

  changeDailyTrip(): void {
    this.dayTripSelected$.next(this.dailyTrips[this.firstDailyTrip?1:0]);
    this.firstDailyTrip = !this.firstDailyTrip;
  }

  clearDailyTrip(): void {
    this.dayTripSelected$.next(null);
  }

  getDailyTrips() : Array<IDailyTrip> {
    let ret = new Array<IDailyTrip>();
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
}
