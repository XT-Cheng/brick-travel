import { Injectable } from '@angular/core';
import { Epic, createEpicMiddleware } from 'redux-observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';

import { IAppState } from '../../store.model';
import { CityService } from './city.service';
import { CityActionGenerator } from './city.action';
import { EntityAction, EntityActionTypeEnum, EntityTypeEnum } from '../entity.action';

@Injectable()
export class CityEpic {
  constructor(
    private _service: CityService,
    private _action: CityActionGenerator,
  ) {}

  public createEpic() {
    return createEpicMiddleware(this.createEpicInternal(EntityTypeEnum.CITY));
  }

  private createEpicInternal(entityType : EntityTypeEnum ): Epic<EntityAction, IAppState> {
    return (action$, store) => action$
    .ofType(EntityActionTypeEnum.LOAD)
    .filter(action => action.meta.entityType ===  entityType && !!action.meta.pagination)
      .switchMap(action => this._service.getCities(action.meta.pagination)
      .map(data => this._action.loadCitySucceeded(data))
        .catch(response => 
          of(this._action.loadCityFailed(response))
        )
        .startWith(this._action.loadCityStarted()));
  }
}
