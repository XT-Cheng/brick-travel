import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, take, filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

import { AuthService } from './@core/auth/providers/authService';
import { of } from 'rxjs/observable/of';

@Injectable()
export class PageRoutingGuard implements CanActivate, CanActivateChild {
  private _selector = 'nb-global-spinner';

  constructor(private _authService: AuthService, private _router: Router, @Inject(DOCUMENT) private _document ) {
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.hideSpinner();
    });
   }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): Observable<boolean> {
    return of(true);
    // return this._authService.onTokenChange().pipe(
    //   take(1),
    //   map((authToken) => {
    //     if (authToken.isValid()) {
    //       return true;
    //     } else {
    //       this._router.navigate(['/auth/login']);
    //       return false;
    //     }
    //   })
    // );
  }

  private hideSpinner(): void {
    const el = this.getSpinnerElement();
    if (el) {
      el.style['display'] = 'none';
    }
  }

  private getSpinnerElement() {
    return this._document.getElementById(this._selector);
  }
}
