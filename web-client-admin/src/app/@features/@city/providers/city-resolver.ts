import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { SelectorService } from '../../../@core/store/providers/selector.service';

@Injectable()
export class CityResolver implements Resolve<string> {
  constructor(private selectorService: SelectorService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    return of(this.selectorService.citySearchKey);
  }
}
