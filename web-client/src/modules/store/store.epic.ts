import { Injectable } from '@angular/core';

import { EntityEpics } from './entity/entity.epic';
import { DirtyEpics } from './dirty/drity.epic';
import { combineEpics } from 'redux-observable';

@Injectable()
export class RootEpics {
  constructor(private _entityEpic: EntityEpics,private _dirtyEpic: DirtyEpics) {}

  public createEpics() {
    return combineEpics(
      this._entityEpic.createEpics(),
      this._dirtyEpic.createEpics()
    );
  }
}
