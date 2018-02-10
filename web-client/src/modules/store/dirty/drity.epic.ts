import { Injectable } from '@angular/core';

import { TravelAgendaService } from '../../../providers/travelAgenda.service';

@Injectable()
export class DirtyEpics {
  constructor(private _travelAgendaService: TravelAgendaService) {}

  public createEpics() {
    return this._travelAgendaService.createFlushEpic();
  }
}