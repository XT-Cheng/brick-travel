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
import { INIT_UI_TRAVELAGENDA_STATE,STORE_UI_TRAVELAGENDA_KEY, ITravelAgendaUI } from '../modules/store/ui/travelAgenda/travelAgenda.model';

interface IUITravelAgendaActionMetaInfo extends IActionMetaInfo {
}

interface IUITravelAgendaActionPayload extends IActionPayload {
    selectedTravelAgendaId: string,
    selectedDailyTripId: string
}

const defaultUIAgendaActionPayload = {
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
            return Immutable(state).set(STORE_UI_TRAVELAGENDA_KEY.selectedTravelAgendaId, action.payload.selectedTravelAgendaId);
        }
        case UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP: {
            return Immutable(state).set(STORE_UI_TRAVELAGENDA_KEY.selectedDailyTripId, action.payload.selectedDailyTripId);
        }
    }
    return <any>state;
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
    private loadTravelAgendaStartedAction = entityLoadActionStarted(EntityTypeEnum.TRAVELAGENDA);

    @dispatch()
    private loadTravelAgendasAction = entityLoadAction(EntityTypeEnum.TRAVELAGENDA);

    private loadTravelAgendaSucceededAction = entityLoadActionSucceeded(EntityTypeEnum.TRAVELAGENDA);

    private loadTravelAgendaFailedAction = entityLoadActionFailed(EntityTypeEnum.TRAVELAGENDA)

    //#endregion

    //#region update actions

    @dispatch()
    private updateTravelAgendaAction = entityUpdateAction<ITravelAgenda>(EntityTypeEnum.TRAVELAGENDA, 'travelAgendas');

    @dispatch()
    private updateTravelViewPointAction = entityUpdateAction<ITravelViewPoint>(EntityTypeEnum.TRAVELVIEWPOINT, 'travelViewPoints');

    @dispatch()
    private updateDailyTripAction = entityUpdateAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP, 'dailyTrips');
   
    //#endregion

    //#region insert actions
    @dispatch()
    private insertDailyTripAction = entityInsertAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP, 'dailyTrips');

    @dispatch()
    private insertTravelAgendaAction = entityInsertAction<ITravelAgenda>(EntityTypeEnum.TRAVELAGENDA, 'travelAgendas');
    
    @dispatch()
    private insertTravelViewPointAction = entityInsertAction<ITravelViewPoint>(EntityTypeEnum.TRAVELVIEWPOINT, 'travelViewPoints');
    
    //#endregion

    //#region delete actions
    @dispatch()
    private deleteDailyTripAction = entityDeleteAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP, 'dailyTrips');

    @dispatch()
    private deleteTravelViewPointAction = entityDeleteAction<ITravelViewPoint>(EntityTypeEnum.TRAVELVIEWPOINT, 'travelViewPoints');

     @dispatch()
    private deleteTravelAgendaAction = entityDeleteAction<ITravelAgenda>(EntityTypeEnum.TRAVELAGENDA, 'travelAgendas');

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
            payload: Object.assign({}, defaultUIAgendaActionPayload, {
                selectedTravelAgendaId: typeof selectedTravelAgenda === 'string' ? selectedTravelAgenda : selectedTravelAgenda.id
            })
        };
    }

    @dispatch()
    private selectDailyTripAction(selectedDailyTrip: IDailyTripBiz | string): UITravelAgendaAction {
        return {
            type: UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP,
            meta: { progressing: false },
            payload: Object.assign({}, defaultUIAgendaActionPayload, {
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
                .map(data => this.loadTravelAgendaSucceededAction(data))
                .catch(response =>
                    of(this.loadTravelAgendaFailedAction(response))
                )
                .startWith(this.loadTravelAgendaStartedAction()));
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
        this.loadTravelAgendasAction(queryCondition);
    }

    public select(travelAgenda: ITravelAgendaBiz) {
        this.selectTravelAgendaAction(travelAgenda.id);
    }

    public selectDailyTrip(dailyTrip: IDailyTripBiz) {
        this.selectDailyTripAction(dailyTrip?dailyTrip.id:'');
    }

    public addTravelAgenda(): ITravelAgendaBiz {
        let added = createTravelAgenda();
        this.insertTravelAgendaAction(added.id, translateTravelAgendaFromBiz(added));
        this.select(added);
        return added;
    }

    public addDailyTrip(travelAgenda: ITravelAgendaBiz): IDailyTripBiz {
        let added = createDailiyTrip(travelAgenda);
        travelAgenda.dailyTrips.push(added);
        this.insertDailyTripAction(added.id, translateDailyTripFromBiz(added));
        this.updateTravelAgendaAction(travelAgenda.id, translateTravelAgendaFromBiz(travelAgenda));
        this.selectDailyTrip(added);
        return added;
    }

    public addTravelViewPoint(viewPoint : IViewPointBiz,dailyTrip: IDailyTripBiz): ITravelViewPointBiz {
        let added = createTravelViewPoint(viewPoint,dailyTrip);
        dailyTrip.travelViewPoints.push(added);
        this.insertTravelViewPointAction(added.id, translateTravelViewPointFromBiz(added));
        this.updateDailyTripAction(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));

        return added;
    }

    public removeDailyTrip(dailyTrip : IDailyTripBiz) : ITravelAgendaBiz {
        dailyTrip.travelAgenda.dailyTrips = dailyTrip.travelAgenda.dailyTrips.filter(trip => trip.id !== dailyTrip.id);
        this.deleteDailyTripAction(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));
        this.updateTravelAgendaAction(dailyTrip.travelAgenda.id, translateTravelAgendaFromBiz(dailyTrip.travelAgenda));
        return dailyTrip.travelAgenda;
    }

    public removeTravelViewPoint(travelViewPoint: ITravelViewPointBiz) {
        this.deleteTravelViewPointAction(travelViewPoint.id, translateTravelViewPointFromBiz(travelViewPoint));
        this.updateDailyTripAction(travelViewPoint.dailyTrip.id, translateDailyTripFromBiz(travelViewPoint.dailyTrip));
    }
}