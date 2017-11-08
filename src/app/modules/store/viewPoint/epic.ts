import { Injectable } from '@angular/core';
import { Epic, createEpicMiddleware } from 'redux-observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';

import { IAppState } from '../model';
import { ViewPointService } from './service';
import { ViewPointAction } from './action';
import { GeneralAction } from '../action';

@Injectable()
export class ViewPointEpic {
  constructor(
    private _service: ViewPointService,
    private _action: ViewPointAction,
  ) {}

  public createEpic() {
    return createEpicMiddleware(this.createLoadViewPointEpic());
  }

  private createLoadViewPointEpic(): Epic<GeneralAction, IAppState> {
    return (action$, store) => action$
      .ofType(ViewPointAction.LOAD_VIEWPOINTS)
      //.filter(action => actionIsForCorrectAnimalType(animalType)(action))
      //.filter(() => animalsNotAlreadyFetched(animalType, store.getState()))
      .switchMap(() => this._service.getViewPoints()
        .map(data => this._action.loadViewPointSucceeded(data.viewPoints,data.viewPointComments))
        .catch(response => 
          of(this._action.loadViewPointFailed(response))
        )
        .startWith(this._action.loadViewPointStarted()));
  }
}
