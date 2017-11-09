import { Injectable } from '@angular/core';
import { Epic, createEpicMiddleware } from 'redux-observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';

import { IAppState } from '../model';
import { CityService } from './service';
import { CityAction } from './action';
import { GeneralAction } from '../action';

@Injectable()
export class CityEpic {
  constructor(
    private _service: CityService,
    private _action: CityAction,
  ) {}

  public createEpic() {
    return createEpicMiddleware(this.createLoadCityEpic());
  }

  private createLoadCityEpic(): Epic<GeneralAction, IAppState> {
    return (action$, store) => action$
      .ofType(CityAction.LOAD_CITIES)
      .switchMap(action => this._service.getCities(action.meta.pagination)
        .map(data => this._action.loadCitySucceeded(data.cities,action.meta.pagination))
        .catch(response => 
          of(this._action.loadCityFailed(response))
        )
        .startWith(this._action.loadCityStarted()));
  }
}
