import { Injectable } from '@angular/core';
import { Epic, createEpicMiddleware } from 'redux-observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';

import { IAppState } from '../store.model';
import { ViewPointService } from './viewPoint.service';
import { ViewPointAction } from './viewPoint.action';
import { GeneralAction, EntityActionTypeEnum, EntityTypeEnum } from '../store.action';

@Injectable()
export class ViewPointEpic {
  constructor(
    private _service: ViewPointService,
    private _action: ViewPointAction,
  ) {}

  public createEpic() {
    return createEpicMiddleware(this.createEpicInternal(EntityTypeEnum.VIEWPOINT));
  }

  private createEpicInternal(entityType : EntityTypeEnum): Epic<GeneralAction, IAppState> {
    return (action$, store) => action$
      .ofType(EntityActionTypeEnum.LOAD)
      .filter(action => action.meta.entityType === entityType && !!action.meta.pagination)
      .switchMap(action => {
        return this._service.getViewPoints(action.meta.pagination)
        .map(data => this._action.loadViewPointSucceeded(data))
        .catch(response => 
          of(this._action.loadViewPointFailed(response))
        )
        .startWith(this._action.loadViewPointStarted())
      });
  }
}
