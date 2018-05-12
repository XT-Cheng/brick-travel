import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { CityUIService } from '../../../@core/store/providers/city.ui.service';

@Injectable()
export class CityResolver implements Resolve<string> {
  constructor(private _cityUIService: CityUIService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    return of(this._cityUIService.searchKey);
  }
}
