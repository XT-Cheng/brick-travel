import { Injectable } from '@angular/core';
import { combineEpics } from 'redux-observable';

import { CityService } from '../providers/city.service';
import { UserService } from '../providers/user.service';
import { ViewPointService } from '../providers/viewPoint.service';

@Injectable()
export class EntityEpics {
  constructor(private _cityService: CityService, private _viewPointService: ViewPointService,
    private _userService: UserService) { }

  public createEpics() {
    return [combineEpics(
      ...this._cityService.createEpic(),
      ...this._viewPointService.createEpic(),
      ...this._userService.createEpic()
    )];
  }
}
