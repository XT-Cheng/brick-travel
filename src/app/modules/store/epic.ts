import { Injectable } from '@angular/core';
import { CityEpic } from './city/epic';
import { ViewPointEpic } from './viewPoint/epic';

@Injectable()
export class RootEpics {
  constructor(private _cityEpic: CityEpic,private _viewPointEpic: ViewPointEpic) {}

  public createEpics() {
    return [
      this._cityEpic.createEpic(),this._viewPointEpic.createEpic()
    ];
  }
}
