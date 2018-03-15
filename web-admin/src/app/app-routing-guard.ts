import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs/Observable';
import { DataSyncService } from './@core/store/providers/dataSync.service';

@Injectable()
export class RoutingGuard implements CanActivate {
  constructor(private _dataSyncService: DataSyncService, private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let url: string = state.url;

    return this.checkStateRestored();
  }

  checkStateRestored(): Observable<boolean> {
    return this._dataSyncService.isStateRestored().take(1);
  }
}