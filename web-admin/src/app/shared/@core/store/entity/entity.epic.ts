import { Injectable } from '@angular/core';
import { combineEpics } from 'redux-observable';

import { CityService } from '../providers/city.service';
import { ViewPointService } from '../providers/viewPoint.service';
import { FilterCategoryService } from '../providers/filterCategory.service';
import { TravelAgendaService } from '../providers/travelAgenda.service';
import { UserService } from '../providers/user.service';

@Injectable()
export class EntityEpics {
  constructor(private _cityService: CityService,private _viewPointService: ViewPointService,
    private _travelAgendaService: TravelAgendaService,
    private _filterCategoryService: FilterCategoryService,
    private _userService : UserService) {}

  public createEpics() {
    return [combineEpics(
      ...this._cityService.createEpic(),
      ...this._viewPointService.createEpic(),
      ...this._travelAgendaService.createEpic(),
      ...this._filterCategoryService.createEpic(),
      ...this._userService.createEpic()
    )];
  }
}
