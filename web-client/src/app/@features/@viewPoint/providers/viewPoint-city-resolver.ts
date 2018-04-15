import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ViewPointCityResolver implements Resolve<string> {
  constructor() {}

  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    return Observable.of(route.paramMap.get('city'));
  }
}