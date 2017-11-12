import { Injectable } from '@angular/core';
import { CityEpic } from './city/epic';
import { ViewPointEpic } from './viewPoint/epic';
import { TravelAgendaEpic } from './travelAgenda/epic';

@Injectable()
export class RootEpics {
  constructor(private _cityEpic: CityEpic,private _viewPointEpic: ViewPointEpic,private _travelAgendaEpic: TravelAgendaEpic) {}

  public createEpics() {
    return [
      this._cityEpic.createEpic(),this._viewPointEpic.createEpic(),this._travelAgendaEpic.createEpic()
    ];
  }
}
