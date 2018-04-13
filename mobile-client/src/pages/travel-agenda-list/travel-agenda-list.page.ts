import { Component } from '@angular/core';
import { App } from 'ionic-angular';

import { ITravelAgendaBiz } from 'shared/@core/store/bizModel/travelAgenda.biz.model';
import { SelectorService } from 'shared/@core/store/providers/selector.service';
import { TravelAgendaService } from 'shared/@core/store/providers/travelAgenda.service';
import { TravelAgendaPage } from '../travel-agenda/travel-agenda.page';

@Component({
  selector: 'page-travel-agenda-list',
  templateUrl: 'travel-agenda-list.page.html',
})
export class TravelAgendaListPage {
//#region Private member

  //#endregion

  //#region Constructor
  constructor(private _app : App,
    private _travelAgendaService : TravelAgendaService,
    protected _selector: SelectorService) {
  }
  //#endregion

  //#region Implements interface

  //#endregion

  //#region Protected methods
  protected travelAgendaClicked(travelAgenda : ITravelAgendaBiz) {
    this._travelAgendaService.selectTravelAgenda(travelAgenda);
    this._app.getRootNav().push(TravelAgendaPage);
  }
  //#endregion
}
