import { Injectable } from '@angular/core';
import { combineEpics } from 'redux-observable';

import { CityService } from '../providers/city.service';
import { FilterCategoryService } from '../providers/filterCategory.service';
import { MasterDataService } from '../providers/masterData.service';
import { UserService } from '../providers/user.service';
import { ViewPointService } from '../providers/viewPoint.service';

@Injectable()
export class EntityEpics {
  constructor(private _cityService: CityService, private _viewPointService: ViewPointService,
    private _userService: UserService, private _filterCategoryService: FilterCategoryService,
    private _masterDataService: MasterDataService) { }

  public createEpics() {
    return [combineEpics(
      ...this._cityService.createEpic(),
      ...this._viewPointService.createEpic(),
      ...this._userService.createEpic(),
      ...this._filterCategoryService.createEpic(),
      ...this._masterDataService.createEpic()
    )];
  }
}
