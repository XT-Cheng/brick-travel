import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';

import { Injectable } from '@angular/core';
import { Epic } from 'redux-observable';
import { of } from 'rxjs/observable/of';

import { IAppState } from '../../store.model';
import { EntityAction, EntityActionTypeEnum, EntityTypeEnum, EntityActionPhaseEnum } from '../entity.action';
import { ViewPointActionGenerator } from './viewPoint.action';
import { ViewPointService } from './viewPoint.service';

@Injectable()
export class ViewPointEpic {
  constructor(
    private _service: ViewPointService,
    private _action: ViewPointActionGenerator,
  ) {}

  public createEpic() {
    return this.createEpicInternal(EntityTypeEnum.VIEWPOINT);
  }

  private createEpicInternal(entityType : EntityTypeEnum): Epic<EntityAction, IAppState> {
    return (action$, store) => action$
      .ofType(EntityActionTypeEnum.LOAD)
      .filter(action => action.meta.entityType === entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
      .switchMap(action => {
        return this._service.getViewPoints(action.meta.pagination,action.payload.queryCondition)
        .map(data => this._action.loadViewPointSucceeded(data))
        .catch(response => 
          of(this._action.loadViewPointFailed(response))
        )
        .startWith(this._action.loadViewPointStarted())
      });
  }
}
