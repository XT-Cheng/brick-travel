import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CityAction } from '../../app/modules/store/city/action';
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { ICity } from '../../app/modules/store/city/model';
import { ViewPointAction } from '../../app/modules/store/viewPoint/action';
import { IAppState } from '../../app/modules/store/model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class HomePage implements AfterViewInit {
  data : ICity[];

  constructor(private _store: NgRedux<IAppState>,private _cityAction : CityAction,private _viewPointAction : ViewPointAction) {
  }

  @select(['entities','cities'])
  readonly cities$: Observable<ICity[]>;

  ngAfterViewInit(): void {
    this._cityAction.loadCities();
    //this._viewPointAction.loadViewPoints();

    this.cities$.subscribe(data => this.data = (<any>data).asMutable({deep: true}));
  }

  fetchMore() {
    this._cityAction.loadCities(1,50);
  }
}
