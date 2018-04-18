import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ViewPointCityResolver implements Resolve<string> {
  constructor() { }

  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    return of(route.paramMap.get('city'));
  }
}
