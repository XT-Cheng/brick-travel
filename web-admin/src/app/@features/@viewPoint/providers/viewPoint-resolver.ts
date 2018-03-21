import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Injectable }             from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { CityService } from '../../../@core/store/providers/city.service';
import { SelectorService } from '../../../@core/store/providers/selector.service';

@Injectable()
export class ViewPointResolver implements Resolve<string> {
  constructor(private selectorService: SelectorService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    return Observable.of(this.selectorService.viewPointSearchKey);
  }
}