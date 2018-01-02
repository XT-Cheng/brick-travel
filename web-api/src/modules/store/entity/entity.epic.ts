import { Injectable } from '@angular/core';
import { CityEpic } from './city/city.epic';
import { ViewPointEpic } from './viewPoint/viewPoint.epic';
import { TravelAgendaEpic } from './travelAgenda/travelAgenda.epic';
import { FilterCategoryEpic } from './filterCategory/filterCategory.epic';

@Injectable()
export class EntityEpics {
  constructor(private _cityEpic: CityEpic,private _viewPointEpic: ViewPointEpic,
    private _travelAgendaEpic: TravelAgendaEpic,private _filterCategoryEpic: FilterCategoryEpic) {}

  public createEpics() {
    return [
      this._cityEpic.createEpic(),this._viewPointEpic.createEpic(),this._travelAgendaEpic.createEpic(),this._filterCategoryEpic.createEpic()
    ];
  }
}
