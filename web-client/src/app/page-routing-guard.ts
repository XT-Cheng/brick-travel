import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from 'shared/@core/auth/providers/authService';

@Injectable()
export class PageRoutingGuard implements CanActivate, CanActivateChild {
  constructor(private _authService: AuthService, private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): Observable<boolean> {
    return this._authService.onTokenChange().take(1).map((authToken) => {
      if (authToken.isValid()) {
        return true;
      }
      else {
        this._router.navigate(['/auth/login']);
        return false;
      }
    });
  }
}