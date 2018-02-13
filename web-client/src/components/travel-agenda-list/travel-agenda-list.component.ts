import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ITravelAgendaBiz } from '../../bizModel/model/travelAgenda.biz.model';

@Component({
  selector: 'travel-agenda-list',
  templateUrl: 'travel-agenda-list.component.html'
})
export class TravelAgendaListComponent {
  //#region Protected member

  //#endregion

  //#region Private member

  //#endregion

  //#region Event
  @Output() travelAgendaClickedEvent: EventEmitter<ITravelAgendaBiz>;
  //#endregion

  //#region Constructor
  constructor() {
      this.travelAgendaClickedEvent = new EventEmitter<ITravelAgendaBiz>();
  }
  //#endregion

  //#region Protected property
  @Input() protected travelAgendas: Array<ITravelAgendaBiz>;
  //#endregion

  //#region Public property

  //#endregion

  //#region Implements interface

  //#endregion Implements interface

  //#region Public method

  //#endregion

  //#region Protected method

  protected clicked(ta: ITravelAgendaBiz) {
    this.travelAgendaClickedEvent.emit(ta);
  }
  
  //#endregion

  //#region Private method

  //#endregion
}
