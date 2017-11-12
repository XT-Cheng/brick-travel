import { Injectable } from '@angular/core';
import { Epic, createEpicMiddleware } from 'redux-observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';

import { IAppState } from '../model';
import { GeneralAction, EntityActionTypeEnum, EntityTypeEnum } from '../action';
import { TravelAgendaService } from './service';
import { TravelAgendaAction } from './action';

@Injectable()
export class TravelAgendaEpic {
  constructor(
    private _service: TravelAgendaService,
    private _action: TravelAgendaAction,
  ) {}

  public createEpic() {
    return createEpicMiddleware(this.createLoadTravelAgendaEpic());
  }

  private createLoadTravelAgendaEpic(): Epic<GeneralAction, IAppState> {
    return (action$, store) => action$
    .ofType(EntityActionTypeEnum.LOAD)
    .filter(action => action.meta.entityType === EntityTypeEnum.TRAVELAGENDA && !!action.meta.pagination)
      .switchMap(action => this._service.getTravelAgenda(action.meta.pagination)
      .map(data => this._action.loadTravelAgendaSucceeded(data))
        .catch(response => 
          of(this._action.loadTravelAgendaFailed(response))
        )
        .startWith(this._action.loadTravelAgendaStarted()));
  }
}
