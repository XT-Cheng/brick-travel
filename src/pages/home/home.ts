import { Component, AfterViewInit } from '@angular/core';
import { CityAction } from '../../app/modules/store/city/action';
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { ICity } from '../../app/modules/store/city/model';
import { ViewPointAction } from '../../app/modules/store/viewPoint/action';
import { IViewPoint } from '../../app/modules/store/viewPoint/model';
import { IAppState } from '../../app/modules/store/model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {
  constructor(private _store: NgRedux<IAppState>,private _cityAction : CityAction,private _viewPointAction : ViewPointAction) {
  }

  @select(['entities','viewPoints'])
  readonly viewPoints$: Observable<IViewPoint[]>;

  ngAfterViewInit(): void {
    this._cityAction.loadCities();
    this._viewPointAction.loadViewPoints();
  }
}
