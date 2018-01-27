import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { createTravelAgenda, translateTravelAgendaFromBiz } from '../../bizModel/model/travelAgenda.biz.model';
import { TravelAgendaActionGenerator } from '../../modules/store/entity/travelAgenda/travelAgenda.action';
import { UIActionGenerator } from '../../modules/store/ui/ui.action';
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
  protected travelAgendaPage = TravelAgendaPage;
  
  //#endregion

  //#region Constructor
  constructor(private _uiActionGeneration: UIActionGenerator,
              private _entityActionGeneration: TravelAgendaActionGenerator) {
  }
  //#endregion

  //#region Implements interface
  ngAfterViewInit(): void {
  }
  //#endregion

  //#region Protected method
  protected onNewAgenda(event) {
    let createdTravelAgenda = createTravelAgenda();
    this._entityActionGeneration.insertTravelAgenda(createdTravelAgenda.id,translateTravelAgendaFromBiz(createdTravelAgenda));
    //this._entityActionGeneration.flushTravelAgenda(createdTravelAgenda._id);
    this._uiActionGeneration.selectTravelAgenda(createdTravelAgenda);
  }
  //#endregion
}
