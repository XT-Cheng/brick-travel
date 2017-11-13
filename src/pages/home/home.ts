import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ViewPointAction } from '../../modules/store/viewPoint/action';
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IViewPoint } from '../../modules/store/viewPoint/model';
import { CityAction } from '../../modules/store/city/action';
import { TravelAgendaAction } from '../../modules/store/travelAgenda/action';
import { ICity } from '../../modules/store/city/model';
import { IAppState } from '../../modules/store/model';

import { asMutable,isImmutable } from 'seamless-immutable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class HomePage implements AfterViewInit {

  //@select(['entities','viewPoints'])
  //@select(getViewPoints)
  private viewPoints$ : Observable<Map<string,IViewPoint>>;

  //@select(['entities','cities'])
  //private cities$ : Observable<Map<string,ICity>>

  constructor(private _store: NgRedux<IAppState>,private _viewPointAction : ViewPointAction,private _cityAction : CityAction,private _travelAgendaAction : TravelAgendaAction) {
    this.viewPoints$ = this._store.select<{ [id : string] : IViewPoint }>(['entities','viewPoints']).map(data => {
      let map = new Map<string,IViewPoint>();
      let comments = asMutable(_store.getState().entities.viewPointComments,{deep: true});
      let viewPoints = asMutable(data,{deep: true});
      Object.keys(viewPoints).forEach(key => {
          let viewPoint = viewPoints[key];
          viewPoint.comments = viewPoint.comments.map(id => comments[<any>id]);
          map.set(key, viewPoint);
      });
      
      return map;
    });
  }

  ngAfterViewInit(): void {
    //this._cityAction.loadCities();
    this._viewPointAction.loadViewPoints();
    //this._travelAgendaAction.loadTravelAgendas();
    // this.viewPoints$.subscribe(data => {
    //   console.log('viewPoints$:' + data);
    // });
    this.viewPoints$.subscribe(data => {
      for (let value of data.values()) {
        console.log(value);
      }
    });
  }

  fetchMore() :void {
    //this._cityAction.loadCities(1,50);
    this._viewPointAction.loadViewPoints(1,50);
    //this._travelAgendaAction.loadTravelAgendas();
  }
}
