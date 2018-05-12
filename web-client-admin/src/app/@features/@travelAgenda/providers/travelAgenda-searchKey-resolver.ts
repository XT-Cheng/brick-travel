import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { TravelAgendaUIService } from '../../../@core/store/providers/travelAgenda.ui.service';

@Injectable()
export class TravelAgendaSearchKeyResolver implements Resolve<string> {
  constructor(private _travelAgendaUIService: TravelAgendaUIService) { }

  resolve(): Observable<string> {
    return of(this._travelAgendaUIService.searchKey);
  }
}
