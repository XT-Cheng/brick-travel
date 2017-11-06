import { Injectable } from '@angular/core';
import { CityEpics } from './models/city/epics';

@Injectable()
export class RootEpics {
  constructor(private cityEpic: CityEpics) {}

  public createEpics() {
    return [
      this.cityEpic.createEpic()
    ];
  }
}
