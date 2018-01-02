import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { ViewPointsListPage } from '../view-points-list/view-points-list.page';
import { TravelAgendaPage } from '../travel-agenda/travel-agenda.page';

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html',
})
export class HomePage implements AfterViewInit {
  //#region Private member

  //#endregion

  //#region Protected member

  protected viewPointsListPage = ViewPointsListPage;
  protected travelAgendaPage = TravelAgendaPage;
  
  //#endregion

  //#region Constructor
  constructor() {
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
