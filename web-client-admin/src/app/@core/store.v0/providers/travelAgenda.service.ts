import { dispatch, NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';
import { denormalize, normalize } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { WEBAPI_HOST } from '../../utils/constants';
import {
    caculateDistance,
    createDailiyTrip,
    createTravelAgenda,
    createTravelViewPoint,
    IDailyTripBiz,
    ITravelAgendaBiz,
    ITravelViewPointBiz,
    translateDailyTripFromBiz,
    translateTravelAgendaFromBiz,
    translateTravelViewPointFromBiz,
} from '../bizModel/travelAgenda.biz.model';
import { IViewPointBiz } from '../bizModel/viewPoint.biz.model';
import { dirtyAddAction, DirtyTypeEnum } from '../dirty/dirty.action';
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
} from '../entity/entity.action';
import { IEntities } from '../entity/entity.model';
import { travelAgenda } from '../entity/entity.schema';
import { IDailyTrip, ITravelAgenda, ITravelViewPoint } from '../entity/travelAgenda/travelAgenda.model';
import { IActionMetaInfo, IActionPayload } from '../store.action';
import { IAppState } from '../store.model';
import {
    INIT_UI_TRAVELAGENDA_STATE,
    ITravelAgendaUI,
    STORE_UI_TRAVELAGENDA_KEY,
} from '../ui/travelAgenda/travelAgenda.model';
import { SelectorService } from './selector.service';

interface IUITravelAgendaActionPayload extends IActionPayload {
    searchKey: string;
    selectedTravelAgendaId: string;
    selectedDailyTripId: string;
    selectedTravelViewPointId: string;
}

const defaultUIAgendaActionPayload = {
    searchKey: '',
    selectedTravelAgendaId: '',
    selectedDailyTripId: '',
    selectedTravelViewPointId: '',
    error: null,
};

type UITravelAgendaAction = FluxStandardAction<IUITravelAgendaActionPayload, IActionMetaInfo>;

enum UITravelAgendaActionTypeEnum {
    SEARCH_TRAVELADENDA = 'UI:TRAVELADENDA:SEARCH_TRAVELADENDA',
    SELECT_TRAVELADENDA = 'UI:TRAVELAGENDA:SELECT_TRAVELADENDA',
    SELECT_DAILYTRIP = 'UI:TRAVELAGENDA:SELECT_DAILYTRIP',
    SELECT_TRAVELVIEWPOINT = 'UI:TRAVELAGENDA:SELECT_TRAVELVIEWPOINT'
}

export function travelAgendaReducer(state = INIT_UI_TRAVELAGENDA_STATE, action: UITravelAgendaAction): ITravelAgendaUI {
    switch (action.type) {
        case UITravelAgendaActionTypeEnum.SEARCH_TRAVELADENDA: {
            return <any>Immutable(state).set(STORE_UI_TRAVELAGENDA_KEY.searchKey, action.payload.searchKey);
        }
        case UITravelAgendaActionTypeEnum.SELECT_TRAVELADENDA: {
            return <any>Immutable(state).set(STORE_UI_TRAVELAGENDA_KEY.selectedTravelAgendaId, action.payload.selectedTravelAgendaId);
        }
        case UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP: {
            return <any>Immutable(state).set(STORE_UI_TRAVELAGENDA_KEY.selectedDailyTripId, action.payload.selectedDailyTripId);
        }
        case UITravelAgendaActionTypeEnum.SELECT_TRAVELVIEWPOINT: {
            return <any>Immutable(state).set(STORE_UI_TRAVELAGENDA_KEY.selectedTravelViewPointId, action.payload.selectedTravelViewPointId);
        }
    }
    return <any>state;
}

@Injectable()
export class TravelAgendaService {
    //#region Constructor
    constructor(private _http: HttpClient,
        private _selectorService: SelectorService,
        private _store: NgRedux<IAppState>) {
    }
    //#endregion

    //#region Actions

    //#region Entity Actions

    //#region load actions
    private loadTravelAgendaStartedAction = entityLoadActionStarted(EntityTypeEnum.TRAVELAGENDA);

    @dispatch()
    private loadTravelAgendasAction = entityLoadAction(EntityTypeEnum.TRAVELAGENDA);

    private loadTravelAgendaSucceededAction = entityLoadActionSucceeded(EntityTypeEnum.TRAVELAGENDA);

    private loadTravelAgendaFailedAction = entityLoadActionFailed(EntityTypeEnum.TRAVELAGENDA);

    //#endregion

    //#region update actions

    @dispatch()
    private updateTravelAgendaAction = entityUpdateAction<ITravelAgenda>(EntityTypeEnum.TRAVELAGENDA);

    @dispatch()
    private updateTravelViewPointAction = entityUpdateAction<ITravelViewPoint>(EntityTypeEnum.TRAVELVIEWPOINT);

    @dispatch()
    private updateDailyTripAction = entityUpdateAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP);

    //#endregion

    //#region insert actions
    @dispatch()
    private insertDailyTripAction = entityInsertAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP);

    @dispatch()
    private insertTravelAgendaAction = entityInsertAction<ITravelAgenda>(EntityTypeEnum.TRAVELAGENDA);

    @dispatch()
    private insertTravelViewPointAction = entityInsertAction<ITravelViewPoint>(EntityTypeEnum.TRAVELVIEWPOINT);

    //#endregion

    //#region delete actions
    @dispatch()
    private deleteDailyTripAction = entityDeleteAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP);

    @dispatch()
    private deleteTravelViewPointAction = entityDeleteAction<ITravelViewPoint>(EntityTypeEnum.TRAVELVIEWPOINT);

    // @dispatch()
    // private deleteTravelAgendaAction = entityDeleteAction<ITravelAgenda>(EntityTypeEnum.TRAVELAGENDA);

    //#endregion

    //#endregion

    //#region UI Actions
    @dispatch()
    private searchTravelAgendaAction(searchKey: string): UITravelAgendaAction {
        return {
            type: UITravelAgendaActionTypeEnum.SEARCH_TRAVELADENDA,
            meta: { progressing: false },
            payload: Object.assign({}, defaultUIAgendaActionPayload, {
                searchKey: searchKey
            })
        };
    }

    @dispatch()
    private selectTravelAgendaAction(selectedTravelAgendaId: string): UITravelAgendaAction {
        return {
            type: UITravelAgendaActionTypeEnum.SELECT_TRAVELADENDA,
            meta: { progressing: false },
            payload: Object.assign({}, defaultUIAgendaActionPayload, {
                selectedTravelAgendaId: selectedTravelAgendaId
            })
        };
    }

    @dispatch()
    private selectDailyTripAction(selectedDailyTripId: string): UITravelAgendaAction {
        return {
            type: UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP,
            meta: { progressing: false },
            payload: Object.assign({}, defaultUIAgendaActionPayload, {
                selectedDailyTripId: selectedDailyTripId
            })
        };
    }

    @dispatch()
    private selectTravelViewPointAction(selectedTravelViewPointId: string): UITravelAgendaAction {
        return {
            type: UITravelAgendaActionTypeEnum.SELECT_TRAVELVIEWPOINT,
            meta: { progressing: false },
            payload: Object.assign({}, defaultUIAgendaActionPayload, {
                selectedTravelViewPointId: selectedTravelViewPointId
            })
        };
    }

    //#endregion

    //#region Dirty Actions
    @dispatch()
    private addDirtyAction = dirtyAddAction(EntityTypeEnum.TRAVELAGENDA);

    //#endregion

    //#endregion

    //#region Epic
    public createEpic() {
        return [this.createLoadEpic()];
    }

    public createLoadEpic(): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.LOAD).pipe(
                filter(action =>
                    action.meta.entityType === EntityTypeEnum.TRAVELAGENDA && action.meta.phaseType === EntityActionPhaseEnum.TRIGGER),
                switchMap(action => this.getTravelAgenda(action.meta.pagination).pipe(
                    map(data => this.loadTravelAgendaSucceededAction(data)),
                    catchError(response =>
                        of(this.loadTravelAgendaFailedAction(response))
                    ),
                    startWith(this.loadTravelAgendaStartedAction()))
                )
            );
    }

    //#endregion

    //#region Private methods
    private getTravelAgenda(pagination: IPagination): Observable<IEntities> {
        return this._http.get(`${WEBAPI_HOST}/travelAgendas`).pipe(
            map(records => {
                return normalize(records, [travelAgenda]).entities;
            })
        );
    }

    //#endregion

    //#region Public methods
    //#region CRUD methods
    public insertTravelAgenda(id: string) {
        const entities = Immutable(this._store.getState().entities).asMutable({ deep: true });
        const created = denormalize(id, travelAgenda, entities);

        created.dailyTrips.forEach(dt => {
            delete dt.travelAgenda;
            dt.travelViewPoints.forEach(tvp => {
                delete tvp.dailyTrip;
                tvp.viewPoint = tvp.viewPoint.id;
            });
        });

        return this._http.post(`${WEBAPI_HOST}/travelAgendas/`, created);
    }

    public updateTravelAgenda(id: string) {
        const entities = Immutable(this._store.getState().entities).asMutable({ deep: true });
        const updated = denormalize(id, travelAgenda, entities);

        updated.dailyTrips.forEach(dt => {
            delete dt.travelAgenda;
            dt.travelViewPoints.forEach(tvp => {
                delete tvp.dailyTrip;
                tvp.viewPoint = tvp.viewPoint.id;
            });
        });

        return this._http.put(`${WEBAPI_HOST}/travelAgendas`, updated);
    }

    public deleteTravelAgenda(id: string) {
        return this._http.delete(`${WEBAPI_HOST}/travelAgendas/${id}`);
    }
    //#endregion
    public search(searchKey: string) {
        this.searchTravelAgendaAction(searchKey);
    }

    public load(queryCondition?: IQueryCondition) {
        this.loadTravelAgendasAction(queryCondition);
    }

    public selectTravelAgenda(ta: ITravelAgendaBiz) {
        const id = (ta ? ta.id : '');
        const previous = (this._selectorService.selectedTravelAgenda ? this._selectorService.selectedTravelAgenda.id : '');
        if (id !== previous) {
            this.selectTravelAgendaAction(id);
            this.selectDailyTripAction('');
        }
    }

    public selectDailyTrip(dailyTrip: IDailyTripBiz) {
        const id = (dailyTrip ? dailyTrip.id : '');
        const previous = (this._selectorService.selectedDailyTrip ? this._selectorService.selectedDailyTrip.id : '');
        if (id !== previous) {
            this.selectDailyTripAction(id);
            this.selectTravelViewPointAction('');
        }
    }

    public selectTravlViewPoint(travelViewPoint: ITravelViewPointBiz) {
        const id = (travelViewPoint ? travelViewPoint.id : '');
        const previous = (this._selectorService.selectedTravelViewPoint ? this._selectorService.selectedTravelViewPoint.id : '');
        if (id !== previous) {
            this.selectTravelViewPointAction(id);
        }
    }

    public addTravelAgenda(): ITravelAgendaBiz {
        const added = createTravelAgenda();
        this.insertTravelAgendaAction(added.id, translateTravelAgendaFromBiz(added));
        this.addDirtyAction(added.id, DirtyTypeEnum.CREATED);
        this.selectTravelAgenda(added);
        return added;
    }

    public addDailyTrip(ta: ITravelAgendaBiz): IDailyTripBiz {
        const added = createDailiyTrip(ta);
        ta.dailyTrips.push(added);

        this.insertDailyTripAction(added.id, translateDailyTripFromBiz(added));
        this.updateTravelAgendaAction(ta.id, translateTravelAgendaFromBiz(ta));
        this.selectDailyTrip(added);
        this.addDirtyAction(ta.id, DirtyTypeEnum.UPDATED);

        return added;
    }

    public removeDailyTrip(dailyTrip: IDailyTripBiz): ITravelAgendaBiz {
        const isCurrentSelect = (this._selectorService.selectedDailyTrip && this._selectorService.selectedDailyTrip.id === dailyTrip.id);

        dailyTrip.travelAgenda.dailyTrips = dailyTrip.travelAgenda.dailyTrips.filter(trip => trip.id !== dailyTrip.id);

        dailyTrip.travelViewPoints.forEach(tvp => {
            this.deleteTravelViewPointAction(tvp.id, translateTravelViewPointFromBiz(tvp));
        });

        this.deleteDailyTripAction(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));

        this.updateTravelAgendaAction(dailyTrip.travelAgenda.id, translateTravelAgendaFromBiz(dailyTrip.travelAgenda));
        this.addDirtyAction(dailyTrip.travelAgenda.id, DirtyTypeEnum.UPDATED);

        if (dailyTrip.travelAgenda.dailyTrips.length === 0) {
            this.selectDailyTrip(null);
        } else if (isCurrentSelect) {
            this.selectDailyTrip(dailyTrip.travelAgenda.dailyTrips[0]);
        }

        return dailyTrip.travelAgenda;
    }

    public swtichDailyTrip(ta: ITravelAgendaBiz) {
        this.updateTravelAgendaAction(ta.id, translateTravelAgendaFromBiz(ta));
        this.addDirtyAction(ta.id, DirtyTypeEnum.UPDATED);
    }

    public addTravelViewPoint(viewPoint: IViewPointBiz, dailyTrip: IDailyTripBiz): ITravelViewPointBiz {
        const added = createTravelViewPoint(viewPoint, dailyTrip);
        dailyTrip.travelViewPoints.push(added);
        caculateDistance(dailyTrip, this._selectorService.defaultTransportationCategory);

        this.insertTravelViewPointAction(added.id, translateTravelViewPointFromBiz(added));
        if (dailyTrip.travelViewPoints.length > 1) {
            this.updateTravelViewPointAction(dailyTrip.travelViewPoints[dailyTrip.travelViewPoints.length - 2].id,
                translateTravelViewPointFromBiz(dailyTrip.travelViewPoints[dailyTrip.travelViewPoints.length - 2]));
        }
        this.updateDailyTripAction(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));
        this.updateTravelAgendaAction(dailyTrip.travelAgenda.id, translateTravelAgendaFromBiz(dailyTrip.travelAgenda));
        this.selectTravlViewPoint(added);
        this.addDirtyAction(dailyTrip.travelAgenda.id, DirtyTypeEnum.UPDATED);

        return added;
    }

    public removeTravelViewPoint(travelViewPoint: ITravelViewPointBiz) {
        this.deleteTravelViewPointAction(travelViewPoint.id, translateTravelViewPointFromBiz(travelViewPoint));
        this.updateDailyTripAction(travelViewPoint.dailyTrip.id, translateDailyTripFromBiz(travelViewPoint.dailyTrip));
        this.updateTravelAgendaAction(
            travelViewPoint.dailyTrip.travelAgenda.id, translateTravelAgendaFromBiz(travelViewPoint.dailyTrip.travelAgenda));
        this.addDirtyAction(travelViewPoint.dailyTrip.travelAgenda.id, DirtyTypeEnum.UPDATED);
    }

    public updateTraveViewPoint(travelViewPoint: ITravelViewPointBiz) {
        this.updateTravelViewPointAction(travelViewPoint.id, translateTravelViewPointFromBiz(travelViewPoint));
        this.updateDailyTripAction(travelViewPoint.dailyTrip.id, translateDailyTripFromBiz(travelViewPoint.dailyTrip));
        this.updateTravelAgendaAction(
            travelViewPoint.dailyTrip.travelAgenda.id, translateTravelAgendaFromBiz(travelViewPoint.dailyTrip.travelAgenda));
        this.addDirtyAction(travelViewPoint.dailyTrip.travelAgenda.id, DirtyTypeEnum.UPDATED);
    }

    public switchTravelViewPoint(dailyTrip: IDailyTripBiz) {
        caculateDistance(dailyTrip, this._selectorService.defaultTransportationCategory);

        dailyTrip.travelViewPoints.forEach((tvp) => {
            this.updateTravelViewPointAction(tvp.id, translateTravelViewPointFromBiz(tvp));
        });
        this.updateDailyTripAction(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));
        this.updateTravelAgendaAction(dailyTrip.travelAgenda.id, translateTravelAgendaFromBiz(dailyTrip.travelAgenda));
        this.addDirtyAction(dailyTrip.travelAgenda.id, DirtyTypeEnum.UPDATED);
    }

    public publish() {

    }

    //#endregion
}
