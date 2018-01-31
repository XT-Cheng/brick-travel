import { Injectable } from '@angular/core';
import { combineEpics } from 'redux-observable';

import { TravelAgendaEpic } from './travelAgenda/travelAgenda.epic';
import { CityService } from '../../../providers/city.service';
import { ViewPointService } from '../../../providers/viewPoint.service';
import { FilterCategoryService } from '../../../providers/filterCategory.service';

@Injectable()
export class EntityEpics {
  constructor(private _cityService: CityService,private _viewPointService: ViewPointService,
    private _travelAgendaEpic: TravelAgendaEpic,private _filterCategoryService: FilterCategoryService) {}

  public createEpics() {
    return combineEpics(
      this._cityService.createEpic(),
      ...this._viewPointService.createEpic(),
      ...this._travelAgendaEpic.createEpic(),
      this._filterCategoryService.createEpic()
    );
  }
}
