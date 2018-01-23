import { Injectable } from '@angular/core';
import { combineEpics } from 'redux-observable';

import { CityEpic } from './city/city.epic';
import { FilterCategoryEpic } from './filterCategory/filterCategory.epic';
import { TravelAgendaEpic } from './travelAgenda/travelAgenda.epic';
import { ViewPointEpic } from './viewPoint/viewPoint.epic';

@Injectable()
export class EntityEpics {
  constructor(private _cityEpic: CityEpic,private _viewPointEpic: ViewPointEpic,
    private _travelAgendaEpic: TravelAgendaEpic,private _filterCategoryEpic: FilterCategoryEpic) {}

  public createEpics() {
    return combineEpics(
      this._cityEpic.createEpic(),
      this._viewPointEpic.createEpic(),
      ...this._travelAgendaEpic.createEpic(),
      this._filterCategoryEpic.createEpic()
    );
  }
}
