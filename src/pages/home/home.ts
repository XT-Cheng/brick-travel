import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ViewPointAction } from '../../modules/store/viewPoint/action';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IViewPoint } from '../../modules/store/viewPoint/model';
import { CityAction } from '../../modules/store/city/action';
import { TravelAgendaAction } from '../../modules/store/travelAgenda/action';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class HomePage implements AfterViewInit {

  @select(['entities','viewPoints'])
  private viewPoints$ : Observable<IViewPoint[]>;

  constructor(private _viewPointAction : ViewPointAction,private _cityAction : CityAction,private _travelAgendaAction : TravelAgendaAction) {
  }

  ngAfterViewInit(): void {
    //this._cityAction.loadCities();
    //this._viewPointAction.loadViewPoints();
    this._travelAgendaAction.loadTravelAgendas();
    this.viewPoints$.subscribe(data => {
      console.log(data);
    });
  }

  fetchMore() :void {
    this._cityAction.loadCities();
    //this._viewPointAction.loadViewPoints();
    //this._travelAgendaAction.loadTravelAgendas();
  }
}
