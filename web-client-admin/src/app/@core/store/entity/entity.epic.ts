import { Injectable } from '@angular/core';
import { combineEpics } from 'redux-observable';

import { CityService } from '../providers/city.service';

@Injectable()
export class EntityEpics {
  constructor(private _cityService: CityService) { }

  public createEpics() {
    return [combineEpics(
      ...this._cityService.createEpic()
    )];
  }
}
