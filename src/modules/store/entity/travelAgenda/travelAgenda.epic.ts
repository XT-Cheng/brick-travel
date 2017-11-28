import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';

import { Injectable } from '@angular/core';
import { createEpicMiddleware, Epic } from 'redux-observable';
import { of } from 'rxjs/observable/of';

import { IAppState } from '../../store.model';
import { EntityAction, EntityActionTypeEnum, EntityTypeEnum } from '../entity.action';
import { TravelAgendaActionGenerator } from './travelAgenda.action';
import { TravelAgendaService } from './travelAgenda.service';

@Injectable()
export class TravelAgendaEpic {
  constructor(
    private _service: TravelAgendaService,
    private _action: TravelAgendaActionGenerator,
  ) {}

  public createEpic() {
    return createEpicMiddleware(this.createEpicInternal(EntityTypeEnum.TRAVELAGENDA));
  }

  private createEpicInternal(entityType : EntityTypeEnum): Epic<EntityAction, IAppState> {
    return (action$, store) => action$
    .ofType(EntityActionTypeEnum.LOAD)
    .filter(action => action.meta.entityType === entityType && !!action.meta.pagination)
      .switchMap(action => this._service.getTravelAgenda(action.meta.pagination)
      .map(data => this._action.loadTravelAgendaSucceeded(data))
        .catch(response => 
          of(this._action.loadTravelAgendaFailed(response))
        )
        .startWith(this._action.loadTravelAgendaStarted()));
  }
}
