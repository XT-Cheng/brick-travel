import { Injectable } from '@angular/core';
import { combineEpics } from 'redux-observable';

import { FilterCategoryEpic } from './filterCategory/filterCategory.epic';
import { TravelAgendaEpic } from './travelAgenda/travelAgenda.epic';
import { ViewPointEpic } from './viewPoint/viewPoint.epic';
import { CityService } from '../../../providers/city.service';

@Injectable()
export class EntityEpics {
  constructor(private _cityService: CityService,private _viewPointEpic: ViewPointEpic,
    private _travelAgendaEpic: TravelAgendaEpic,private _filterCategoryEpic: FilterCategoryEpic) {}

  public createEpics() {
    return combineEpics(
      this._cityService.createEpic(),
      ...this._viewPointEpic.createEpic(),
      ...this._travelAgendaEpic.createEpic(),
      this._filterCategoryEpic.createEpic()
    );
  }
}
