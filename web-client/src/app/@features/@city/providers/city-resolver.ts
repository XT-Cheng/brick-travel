import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SelectorService } from 'shared/@core/store/providers/selector.service';

@Injectable()
export class CityResolver implements Resolve<string> {
  constructor(private selectorService: SelectorService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    return Observable.of(this.selectorService.citySearchKey);
  }
}