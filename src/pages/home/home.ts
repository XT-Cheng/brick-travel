import { Component, AfterViewInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CityAction } from '../../app/modules/store/city/action';
import { ViewPointAction } from '../../app/modules/store/viewPoint/action';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { ICity } from '../../app/modules/store/city/model';
import { IViewPoint, ViewPointCategory } from '../../app/modules/store/viewPoint/model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {
  constructor(private _navCtrl: NavController,
      private _cityAction : CityAction,private _viewPointAction: ViewPointAction) {
  }

  @select(['cities', 'items'])
  readonly cities$: Observable<ICity[]>;

  @select(['viewPoints', 'items'])
  readonly viewPoints$: Observable<IViewPoint[]>;

  ngAfterViewInit(): void {
    this._cityAction.loadCities();
    this._viewPointAction.loadViewPoints();

    this.cities$.subscribe(data => {
      if (data.length >0)
        console.log(data[0].name);
    });

    this.viewPoints$.subscribe(data => {
      if (data.length >0){
        console.log(data[0].category === ViewPointCategory.View);
        console.log(data[0].category);
      }
        
    });
  }
}
