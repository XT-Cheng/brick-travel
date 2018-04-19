import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { SelectorService } from '../../../@core/store/providers/selector.service';

@Injectable()
export class TravelAgendaSearchKeyResolver implements Resolve<string> {
  constructor(private selectorService: SelectorService) { }

  resolve(): Observable<string> {
    return of(this.selectorService.travelAgendaSearchKey);
  }
}
