import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { filter, map, take } from 'rxjs/operators';

import { CityService } from './@core/store/providers/city.service';
import { DataFlushService } from './@core/store/providers/dataFlush.service';

@Injectable()
export class AppRoutingGuard implements CanActivate {
  constructor(private _dataFlushService: DataFlushService, private _cityService: CityService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // TODO: We need refactor activate logic later
    return forkJoin(this.checkStateRestored(),
      this._cityService.all$.pipe(
        filter((cities => cities.length > 0)),
        map(() => true),
        take(1)))
      .pipe(map(() => true));
  }

  checkStateRestored(): Observable<boolean> {
    return this._dataFlushService.isStateRestored().pipe(take(1));
  }
}
