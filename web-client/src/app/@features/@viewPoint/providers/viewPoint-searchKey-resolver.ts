import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SelectorService } from '../../../shared/@core/store/providers/selector.service';

@Injectable()
export class ViewPointSearchKeyResolver implements Resolve<string> {
  constructor(private selectorService: SelectorService) {}

  resolve(): Observable<string> {
    return Observable.of(this.selectorService.viewPointSearchKey);
  }
}