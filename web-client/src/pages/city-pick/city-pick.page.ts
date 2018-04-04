import { AfterViewInit, Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ICityBiz } from 'shared/@core/store/bizModel/city.biz.model';
import { CityService } from 'shared/@core/store/providers/city.service';
import { SelectorService } from 'shared/@core/store/providers/selector.service';
import { HomePage } from '../home/home.page';
import { DataSyncService } from 'shared/@core/store/providers/dataSync.service';

@Component({
  selector: 'page-city-pick',
  templateUrl: 'city-pick.page.html',
})
export class CityPickPage {
  //#region Private member

  //#endregion

  //#region Constructor
  constructor(private _nav: NavController,
    private _cityService : CityService,
    protected _selector: SelectorService,
    private _dataSyncService : DataSyncService) {
  }
  //#endregion

  //#region Implements interface
  ionViewCanEnter() {
    return this._dataSyncService.isStateRestored().take(1);
  }
  //#endregion

  //#region Protected methods
  protected clicked(city: ICityBiz) {
    this._cityService.selectCity(city);
    this._nav.setRoot(HomePage);
  }
  //#endregion
}
