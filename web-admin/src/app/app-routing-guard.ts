import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DataSyncService } from 'shared/@core/store/providers/dataSync.service';
import { SelectorService } from 'shared/@core/store/providers/selector.service';
import { filter, map, take } from 'rxjs/operators';

@Injectable()
export class AppRoutingGuard implements CanActivate {
  constructor(private _dataSyncService: DataSyncService, private _selectorService : SelectorService, private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let url: string = state.url;

    //TODO: We need refactor activate logic later
    return Observable.forkJoin(this.checkStateRestored(),
    this._selectorService.cities$.pipe(filter((cities => cities.length >0)),map(()=>true),take(1)))
    .pipe(map(()=>true));
  }

  checkStateRestored(): Observable<boolean> {
    return this._dataSyncService.isStateRestored().take(1);
  }
}