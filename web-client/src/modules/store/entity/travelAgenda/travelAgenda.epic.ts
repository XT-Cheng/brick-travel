import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';

import { Injectable } from '@angular/core';
import { Epic } from 'redux-observable';
import { of } from 'rxjs/observable/of';

import { IAppState } from '../../store.model';
import { EntityAction, EntityActionPhaseEnum, EntityActionTypeEnum, EntityTypeEnum } from '../entity.action';
import { TravelAgendaActionGenerator } from './travelAgenda.action';
import { TravelAgendaService } from './travelAgenda.service';

@Injectable()
export class TravelAgendaEpic {
  constructor(
    private _service: TravelAgendaService,
    private _action: TravelAgendaActionGenerator,
  ) { }

  public createEpic() {
    return [this.createEpicLoadInternal(EntityTypeEnum.TRAVELAGENDA)];
  }

  private createEpicLoadInternal(entityType: EntityTypeEnum): Epic<EntityAction, IAppState> {
    return (action$, store) => action$
      .ofType(EntityActionTypeEnum.LOAD)
      .filter(action => action.meta.entityType === entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
      .switchMap(action => this._service.getTravelAgenda(action.meta.pagination)
        .map(data => this._action.loadTravelAgendaSucceeded(data))
        .catch(response =>
          of(this._action.loadTravelAgendaFailed(response))
        )
        .startWith(this._action.loadTravelAgendaStarted()));
  }

  // private createEpicFlushInternal(entityType: EntityTypeEnum): Epic<EntityAction, IAppState> {
  //   return (action$, store) => action$
  //     .ofType(EntityActionTypeEnum.FLUSH)
  //     .filter(action => action.meta.entityType === entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
  //     .switchMap(action => {
  //       return this._service.flushTravelAgenda(action.payload.objectId, store.getState())
  //         .map(() => this._action.flushTravelAgendaSucceeded())
  //         .catch(response =>
  //           of(this._action.flushTravelAgendaFailed(response))
  //         )
  //         .startWith(this._action.flushTravelAgendaStarted())
  //     });
  // }

  // private createEpicInsertInternal(entityType: EntityTypeEnum): Epic<EntityAction, IAppState> {
  //   return (action$, store) => action$
  //     .ofType(EntityActionTypeEnum.INSERT)
  //     .filter(action => action.meta.entityType === entityType)
  //     .map(action => {
  //       return this._action.nonDispatchFlushTravelAgenda(Object.keys(action.payload.entities.travelAgendas)[0]);
  //     });
  // }
}
