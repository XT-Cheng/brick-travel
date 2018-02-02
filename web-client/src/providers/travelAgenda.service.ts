import { dispatch } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';
import { normalize } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as Immutable from 'seamless-immutable';

import {
    createDailiyTrip,
    createTravelAgenda,
    createTravelViewPoint,
    IDailyTripBiz,
    ITravelAgendaBiz,
    ITravelViewPointBiz,
    translateDailyTripFromBiz,
    translateTravelAgendaFromBiz,
    translateTravelViewPointFromBiz,
} from '../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
import {
    EntityAction,
    EntityActionPhaseEnum,
    EntityActionTypeEnum,
    entityDeleteAction,
    entityInsertAction,
    entityLoadAction,
    entityLoadActionFailed,
    entityLoadActionStarted,
    entityLoadActionSucceeded,
    EntityTypeEnum,
    entityUpdateAction,
    IPagination,
    IQueryCondition,
} from '../modules/store/entity/entity.action';
import { IEntities } from '../modules/store/entity/entity.model';
import { travelAgenda } from '../modules/store/entity/entity.schema';
import { IDailyTrip, ITravelAgenda, ITravelViewPoint } from '../modules/store/entity/travelAgenda/travelAgenda.model';
import { IActionMetaInfo, IActionPayload } from '../modules/store/store.action';
import { IAppState } from '../modules/store/store.model';
import { INIT_UI_TRAVELAGENDA_STATE, ITravelAgendaUI } from '../modules/store/ui/travelAgenda/travelAgenda.model';

interface IUITravelAgendaActionMetaInfo extends IActionMetaInfo {
}

interface IUITravelAgendaActionPayload extends IActionPayload {
    selectedTravelAgendaId: string,
    selectedDailyTripId: string
}

const defaultAgendaActionPayload = {
    selectedTravelAgendaId: '',
    selectedDailyTripId: '',
    error: null,
}

type UITravelAgendaAction = FluxStandardAction<IUITravelAgendaActionPayload, IUITravelAgendaActionMetaInfo>;

enum UITravelAgendaActionTypeEnum {
    SELECT_TRAVELADENDA = "UI:TRAVELAGENDA:SELECT_TRAVELADENDA",
    SELECT_DAILYTRIP = "UI:TRAVELAGENDA:SELECT_DAILYTRIP"
}

export function travelAgendaReducer(state = INIT_UI_TRAVELAGENDA_STATE, action: UITravelAgendaAction): ITravelAgendaUI {
    switch (action.type) {
        case UITravelAgendaActionTypeEnum.SELECT_TRAVELADENDA: {
            return Immutable(state).set('selectedTravelAgendaId', action.payload.selectedTravelAgendaId);
        }
        case UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP: {
            return Immutable(state).set('selectedDailyTripId', action.payload.selectedDailyTripId);
        }
    }
    return state;
};

@Injectable()
export class TravelAgendaService {
    //#region Constructor
    constructor(private _http: HttpClient) {
    }
    //#endregion

    //#region Actions

    //#region Entity Actions
    
    //#region load actions
    private loadTravelAgendaStarted = entityLoadActionStarted(EntityTypeEnum.TRAVELAGENDA);

    @dispatch()
    private loadTravelAgendas = entityLoadAction(EntityTypeEnum.TRAVELAGENDA);

    private loadTravelAgendaSucceeded = entityLoadActionSucceeded(EntityTypeEnum.TRAVELAGENDA);

    private loadTravelAgendaFailed = entityLoadActionFailed(EntityTypeEnum.TRAVELAGENDA)

    //#endregion

    //#region update actions

    @dispatch()
    private updateTravelAgenda = entityUpdateAction<ITravelAgenda>(EntityTypeEnum.TRAVELAGENDA, 'travelAgendas');

    @dispatch()
    private updateTravelViewPoint = entityUpdateAction<ITravelViewPoint>(EntityTypeEnum.TRAVELVIEWPOINT, 'travelViewPoints');

    @dispatch()
    private updateDailyTrip = entityUpdateAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP, 'dailyTrips');
   
    //#endregion

    //#region insert actions
    @dispatch()
    private insertDailyTrip = entityInsertAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP, 'dailyTrips');

    @dispatch()
    private insertTravelAgenda = entityInsertAction<ITravelAgenda>(EntityTypeEnum.TRAVELAGENDA, 'travelAgendas');
    
    @dispatch()
    private insertTravelViewPoint = entityInsertAction<ITravelViewPoint>(EntityTypeEnum.TRAVELVIEWPOINT, 'travelViewPoints');
    
    //#endregion

    //#region delete actions
    @dispatch()
    private deleteDailyTrip = entityDeleteAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP, 'dailyTrips');

    @dispatch()
    private deleteTravelViewPoint = entityDeleteAction<ITravelViewPoint>(EntityTypeEnum.TRAVELVIEWPOINT, 'travelViewPoints');

     @dispatch()
    private deleteTravelAgenda = entityDeleteAction<ITravelAgenda>(EntityTypeEnum.TRAVELAGENDA, 'travelAgendas');

    //#endregion

    //#region flush TravelAgenda
    // flushTravelAgendaStarted = entityFlushActionStarted(EntityTypeEnum.TRAVELAGENDA);

    // @dispatch()
    // flushTravelAgenda = entityFlushAction(EntityTypeEnum.TRAVELAGENDA, 'travelAgendas');

    // nonDispatchFlushTravelAgenda = entityFlushAction(EntityTypeEnum.TRAVELAGENDA, 'travelAgendas');

    // flushTravelAgendaSucceeded = entityFlushActionSucceeded(EntityTypeEnum.TRAVELAGENDA);

    // flushTravelAgendaFailed = entityFlushActionFailed(EntityTypeEnum.TRAVELAGENDA)

    //#endregion

    //#endregion

    //#region UI Actions
    @dispatch()
    private selectTravelAgendaAction(selectedTravelAgenda: ITravelAgendaBiz | string): UITravelAgendaAction {
        return {
            type: UITravelAgendaActionTypeEnum.SELECT_TRAVELADENDA,
            meta: { progressing: false },
            payload: Object.assign({}, defaultAgendaActionPayload, {
                selectedTravelAgendaId: typeof selectedTravelAgenda === 'string' ? selectedTravelAgenda : selectedTravelAgenda.id
            })
        };
    }

    @dispatch()
    private selectDailyTripAction(selectedDailyTrip: IDailyTripBiz | string): UITravelAgendaAction {
        return {
            type: UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP,
            meta: { progressing: false },
            payload: Object.assign({}, defaultAgendaActionPayload, {
                selectedDailyTripId: typeof selectedDailyTrip === 'string' ? selectedDailyTrip : selectedDailyTrip.id
            })
        };
    }

    //#endregion

    //#endregion

    //#region Epic
    public createEpic() {
        return [this.createEpicLoadInternal(EntityTypeEnum.TRAVELAGENDA)];
    }

    private createEpicLoadInternal(entityType: EntityTypeEnum): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.LOAD)
            .filter(action => action.meta.entityType === entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
            .switchMap(action => this.getTravelAgenda(action.meta.pagination)
                .map(data => this.loadTravelAgendaSucceeded(data))
                .catch(response =>
                    of(this.loadTravelAgendaFailed(response))
                )
                .startWith(this.loadTravelAgendaStarted()));
    }
    //#endregion

    //#region Private methods
    private getTravelAgenda(pagination: IPagination): Observable<IEntities> {
        return this._http.get('http://localhost:3000/travelAgendas')
            .map(records => {
                return normalize(records, [travelAgenda]).entities;
            })
    }

    //#endregion

    //#region Public methods
    public load(queryCondition?: IQueryCondition) {
        this.loadTravelAgendas(queryCondition);
    }

    public select(travelAgenda: ITravelAgendaBiz) {
        this.selectTravelAgendaAction(travelAgenda.id);
    }

    public selectDailyTrip(dailyTrip: IDailyTripBiz) {
        this.selectDailyTripAction(dailyTrip?dailyTrip.id:'');
    }

    public addTravelAgenda(): ITravelAgendaBiz {
        let added = createTravelAgenda();
        this.insertTravelAgenda(added.id, translateTravelAgendaFromBiz(added));
        return added;
    }

    public addDailyTrip(travelAgenda: ITravelAgendaBiz): IDailyTripBiz {
        let added = createDailiyTrip(travelAgenda);
        travelAgenda.dailyTrips.push(added);
        this.insertDailyTrip(added.id, translateDailyTripFromBiz(added));
        this.updateTravelAgenda(travelAgenda.id, translateTravelAgendaFromBiz(travelAgenda));

        return added;
    }

    public addTravelViewPoint(viewPoint : IViewPointBiz,dailyTrip: IDailyTripBiz): ITravelViewPointBiz {
        let added = createTravelViewPoint(viewPoint,dailyTrip);
        dailyTrip.travelViewPoints.push(added);
        this.insertTravelViewPoint(added.id, translateTravelViewPointFromBiz(added));
        this.updateDailyTrip(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));

        return added;
    }

    public removeDailyTrip(dailyTrip : IDailyTripBiz) : ITravelAgendaBiz {
        dailyTrip.travelAgenda.dailyTrips = dailyTrip.travelAgenda.dailyTrips.filter(trip => trip.id !== dailyTrip.id);
        this.deleteDailyTrip(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));
        this.updateTravelAgenda(dailyTrip.travelAgenda.id, translateTravelAgendaFromBiz(dailyTrip.travelAgenda));
        return dailyTrip.travelAgenda;
    }

    public removeTravelViewPoint(travelViewPoint: ITravelViewPointBiz) {
        this.deleteTravelViewPoint(travelViewPoint.id, translateTravelViewPointFromBiz(travelViewPoint));
        this.updateDailyTrip(travelViewPoint.dailyTrip.id, translateDailyTripFromBiz(travelViewPoint.dailyTrip));
    }
}