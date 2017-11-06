import { Injectable } from '@angular/core';
import { Epic, createEpicMiddleware } from 'redux-observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';

import { IAppState } from '../../models';
import { CityService } from './service';
import { CityActions, CityAction } from './actions';

@Injectable()
export class CityEpics {
  constructor(
    private service: CityService,
    private actions: CityActions,
  ) {}

  public createEpic() {
    return createEpicMiddleware(this.createLoadCityEpic());
  }

  private createLoadCityEpic(): Epic<CityAction, IAppState> {
    return (action$, store) => action$
      .ofType(CityActions.LOAD_CITIES)
      //.filter(action => actionIsForCorrectAnimalType(animalType)(action))
      //.filter(() => animalsNotAlreadyFetched(animalType, store.getState()))
      .switchMap(() => this.service.getCities()
        .map(data => this.actions.loadCitySucceeded(data))
        .catch(response => of(this.actions.loadCityFailed()))
        .startWith(this.actions.loadCityStarted()));
  }
}
