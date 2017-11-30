import { NgRedux } from '@angular-redux/store/lib/src/components/ng-redux';
import { AfterViewInit, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { ICityBiz } from '../../bizModel/model/city.biz.model';
import { getCities } from '../../bizModel/selector/entity/city.selector';
import { CityActionGenerator } from '../../modules/store/entity/city/city.action';
import { IAppState } from '../../modules/store/store.model';
import { UIActionGenerator } from '../../modules/store/ui/ui.action';

@Component({
  selector: 'page-city-pick',
  templateUrl: 'city-pick.page.html',
})
export class CityPickPage implements AfterViewInit {
  //#region Private member
  protected readonly cities$: Observable<ICityBiz[]>;

  //#endregion

  //#region Constructor
  constructor(public _nav: NavController, public _navParams: NavParams,
    private _store: NgRedux<IAppState>,
    private _cityActionGenerator : CityActionGenerator,
    private _uiActionGenerator : UIActionGenerator) {
      this.cities$ = getCities(this._store);
  }
  //#endregion

  //#region Implements interface
  ngAfterViewInit() {
    this._cityActionGenerator.loadCities();
  }

  //#endregion

  //#region Protected methods
  protected clicked(city: ICityBiz) {
    this._uiActionGenerator.selectCity(city);
    //this.nav.setRoot(ViewpointListPage,{'city': city});
  }
  //#endregion
}
