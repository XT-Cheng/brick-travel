import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { ViewPointUIService } from '../../../@core/store/providers/viewPoint.ui.service';

@Injectable()
export class ViewPointSearchKeyResolver implements Resolve<string> {
  constructor(private _viewPointUIService: ViewPointUIService) { }

  resolve(): Observable<string> {
    return of(this._viewPointUIService.searchKey);
  }
}
