import { Component } from '@angular/core';

import { ITravelAgendaBiz } from '../../bizModel/model/travelAgenda.biz.model';
import { SelectorService } from '../../providers/selector.service';

@Component({
  selector: 'page-travel-agenda-list',
  templateUrl: 'travel-agenda-list.page.html',
})
export class TravelAgendaListPage {
//#region Private member

  //#endregion

  //#region Constructor
  constructor(
    protected _selector: SelectorService) {
  }
  //#endregion

  //#region Implements interface

  //#endregion

  //#region Protected methods
  protected travelAgendaClicked(travelAgenda : ITravelAgendaBiz) {

  }
  //#endregion
}
