import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { NavController, NavParams } from 'ionic-angular';

import { ViewPointsPage } from '../view-points/view-points.page';

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html',
})
export class HomePage implements AfterViewInit {
  //#region Private member

  //#endregion

  //#region Protected member

  protected viewPointPage = ViewPointsPage;
  
  //#endregion

  //#region Constructor
  constructor(private _nav: NavController,
              private _navParams: NavParams) {
  }
  //#endregion

  //#region Implements interface
  ngAfterViewInit(): void {
  }
  //#endregion

  //#region Protected method
  protected onTabSelect(event) {

  }
  //#endregion
}
