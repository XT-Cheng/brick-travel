import { AfterViewInit, Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { ICityBiz } from '../../bizModel/model/city.biz.model';
import { CityService } from '../../providers/city.service';
import { SelectorService } from '../../providers/selector.service';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'page-city-pick',
  templateUrl: 'city-pick.page.html',
})
export class CityPickPage implements AfterViewInit {
  //#region Private member
  protected readonly cities$: Observable<ICityBiz[]>;

  //#endregion

  //#region Constructor
  constructor(private _nav: NavController,
    private _selector: SelectorService,
    private _cityService : CityService,) {
      this.cities$ = this._selector.cities;
  }
  //#endregion

  //#region Implements interface
  ngAfterViewInit() {
    this._cityService.load();
  }

  //#endregion

  //#region Protected methods
  protected clicked(city: ICityBiz) {
    this._cityService.selectCity(city);
    this._nav.setRoot(HomePage);
  }
  //#endregion
}
