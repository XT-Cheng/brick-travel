import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { App } from 'ionic-angular';

import { TravelAgendaService } from '../../providers/travelAgenda.service';
import { TravelAgendaListPage } from '../travel-agenda-list/travel-agenda-list.page';
import { TravelAgendaPage } from '../travel-agenda/travel-agenda.page';
import { ViewPointsListPage } from '../view-points-list/view-points-list.page';

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html',
})
export class HomePage implements AfterViewInit {
  //#region Private member

  //#endregion

  //#region Protected member

  protected viewPointsListPage = ViewPointsListPage;
  protected travelAgendaListPage = TravelAgendaListPage;
  
  //#endregion

  //#region Constructor
  constructor(private _travelAgendaService: TravelAgendaService,private _app : App) {
  }
  //#endregion

  //#region Implements interface
  ngAfterViewInit(): void {
  }
  //#endregion

  //#region Protected method
  protected onNewAgenda(event) {
    this._travelAgendaService.addTravelAgenda();
    this._app.getRootNav().push(TravelAgendaPage);
  }
  //#endregion
}
