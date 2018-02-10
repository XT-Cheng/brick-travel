import { dispatch, NgRedux } from '@angular-redux/store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';
import { normalize, denormalize } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as Immutable from 'seamless-immutable';
import * as Rx from 'rxjs'

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
} from '../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
import {
    DirtyAction,
    DirtyActionPhaseEnum,
    DirtyActionTypeEnum,
    dirtyAddAction,
    dirtyFlushAction,
    dirtyFlushActionFailed,
    dirtyFlushActionStarted,
    dirtyFlushActionSucceeded,
    dirtyRemoveAction,
    DirtyTypeEnum,
} from '../modules/store/dirty/dirty.action';
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
import { travelAgenda, travelViewPoint } from '../modules/store/entity/entity.schema';
import { IDailyTrip, ITravelAgenda, ITravelViewPoint } from '../modules/store/entity/travelAgenda/travelAgenda.model';
import { IActionMetaInfo, IActionPayload } from '../modules/store/store.action';
import { IAppState } from '../modules/store/store.model';
import {
    INIT_UI_TRAVELAGENDA_STATE,
    ITravelAgendaUI,
    STORE_UI_TRAVELAGENDA_KEY,
} from '../modules/store/ui/travelAgenda/travelAgenda.model';
import { SelectorService } from './selector.service';
import { ForkJoinObservable } from 'rxjs/observable/ForkJoinObservable';
import { RequestOptions } from '@angular/http';
import { MiddlewareAPI } from 'redux';

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

    private loadTravelAgendaFailedAction = entityLoadActionFailed(EntityTypeEnum.TRAVELAGENDA)

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

    @dispatch()
    private deleteTravelAgendaAction = entityDeleteAction<ITravelAgenda>(EntityTypeEnum.TRAVELAGENDA);

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

    //#region Dirty Actions
    @dispatch()
    private addDirtyAction = dirtyAddAction(EntityTypeEnum.TRAVELAGENDA);

    @dispatch()
    private removeDirtyAction = dirtyRemoveAction(EntityTypeEnum.TRAVELAGENDA);

    private flushDirtyStartedAction = dirtyFlushActionStarted(EntityTypeEnum.TRAVELAGENDA);

    private flushDirtySucceededAction = dirtyFlushActionSucceeded(EntityTypeEnum.TRAVELAGENDA);

    private flushDirtyFailedAction = dirtyFlushActionFailed(EntityTypeEnum.TRAVELAGENDA)

    @dispatch()
    private flushDirtyAction = dirtyFlushAction(EntityTypeEnum.TRAVELAGENDA);

    //#endregion

    //#endregion

    //#region Epic
    public createEpic() {
        return [this.createLoadEpic(),
        this.createFlushEpic()];
    }

    public createLoadEpic(): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.LOAD)
            .filter(action => action.meta.entityType === EntityTypeEnum.TRAVELAGENDA && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
            .switchMap(action => this.getTravelAgenda(action.meta.pagination)
                .map(data => this.loadTravelAgendaSucceededAction(data))
                .catch(response =>
                    of(this.loadTravelAgendaFailedAction(response))
                )
                .startWith(this.loadTravelAgendaStartedAction()));
    }

    public createFlushEpic(): Epic<DirtyAction, IAppState> {
        return (action$, store) => action$
            .ofType(DirtyActionTypeEnum.FLUSH)
            .filter(action => action.meta.entityType === EntityTypeEnum.TRAVELAGENDA && action.meta.phaseType == DirtyActionPhaseEnum.TRIGGER)
            .switchMap(action => this.flushTravelAgenda(store)
                .map((value: { type: string, id: string }) => this.requestFlush(value))
                .map(data => this.flushDirtySucceededAction())
                .catch(response =>
                    of(this.flushDirtyFailedAction(response))
                )
                .startWith(this.flushDirtyStartedAction()));
    }
    //#endregion

    //#region Private methods
    private getTravelAgenda(pagination: IPagination): Observable<IEntities> {
        return this._http.get('http://localhost:3000/travelAgendas')
            .map(records => {
                return normalize(records, [travelAgenda]).entities;
            })
    }

    private requestFlush(value: { type: string, id: string }) {
        switch (value.type) {
            case DirtyTypeEnum.CREATED: {
                return this.insertTravelAgenda(value.id);
            }
            case DirtyTypeEnum.UPDATED: {
                return this.updateTravelAgenda(value.id);
            }
            case DirtyTypeEnum.DELETED: {
                return this.deleteTravelAgenda(value.id);
            }
        }
    }

    private flushTravelAgenda(store: MiddlewareAPI<IAppState>): Observable<any> {
        // let created = denormalize(this._store.getState().dirties.travelAgendas.created, [travelAgenda],
        //     Immutable(this._store.getState().entities).asMutable({ deep: true }));
        // let updated = denormalize(this._store.getState().dirties.travelAgendas.updated, [travelAgenda],
        //     Immutable(this._store.getState().entities).asMutable({ deep: true }));
        // let deleted = denormalize(this._store.getState().dirties.travelAgendas.deleted, [travelAgenda],
        //     Immutable(this._store.getState().entities).asMutable({ deep: true }));
        //return Rx.Observable.forkJoin([this.insertTravelAgenda(), this.updateTravelAgenda(), ...this.deleteTravelAgenda()])
        // .map(records => {
        //     return normalize(records, [travelAgenda]).entities;
        // })
        let ret: { type: string, id: string }[] = [];

        Object.keys(store.getState().dirties.travelAgendas).forEach(key => {
            store.getState().dirties.travelAgendas[key].forEach(id => {
                ret.push({ type: key, id: store.getState().dirties.travelAgendas[key] })
            });
        })
        return Rx.Observable.of(ret);
        //return Rx.Observable.forkJoin([this.insertTravelAgenda(),Rx.Observable.empty()]);
        //throw new Error('Not implemented!')
    }

    private insertTravelAgenda(id: string) {
        let entities = Immutable(this._store.getState().entities).asMutable({ deep: true });
        let created = denormalize(id, travelAgenda, entities);

        created.dailyTrips.forEach(dt => {
            delete dt.travelAgenda;
            dt.travelViewPoints.forEach(tvp => {
                delete tvp.dailyTrip;
                tvp.viewPoint = tvp.viewPoint.id;
            })
        });

        return this._http.post(`http://localhost:3000/travelAgendas/`, created);
    }

    private updateTravelAgenda(id: string) {
        let entities = Immutable(this._store.getState().entities).asMutable({ deep: true });
        let updated = denormalize(id, travelAgenda, entities);

        updated.dailyTrips.forEach(dt => {
            delete dt.travelAgenda;
            dt.travelViewPoints.forEach(tvp => {
                delete tvp.dailyTrip;
                tvp.viewPoint = tvp.viewPoint.id;
            })
        });

        return this._http.put('http://localhost:3000/travelAgendas', updated);
    }

    private deleteTravelAgenda(id: string) {
        return this._http.delete(`http://localhost:3000/travelAgendas/${id}`);
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
        this.selectDailyTripAction(dailyTrip ? dailyTrip.id : '');
    }

    public addTravelAgenda(): ITravelAgendaBiz {
        let added = createTravelAgenda();
        this.insertTravelAgendaAction(added.id, translateTravelAgendaFromBiz(added));
        this.addDirtyAction(added.id, DirtyTypeEnum.CREATED);
        this.select(added);
        return added;
    }

    public addDailyTrip(travelAgenda: ITravelAgendaBiz): IDailyTripBiz {
        let added = createDailiyTrip(travelAgenda);
        travelAgenda.dailyTrips.push(added);

        this.insertDailyTripAction(added.id, translateDailyTripFromBiz(added));
        this.updateTravelAgendaAction(travelAgenda.id, translateTravelAgendaFromBiz(travelAgenda));
        this.selectDailyTrip(added);
        this.addDirtyAction(travelAgenda.id, DirtyTypeEnum.UPDATED);

        return added;
    }

    public removeDailyTrip(dailyTrip: IDailyTripBiz): ITravelAgendaBiz {
        let isCurrentSelect = (this._selectorService.selectedDailyTrip && this._selectorService.selectedDailyTrip.id == dailyTrip.id)

        dailyTrip.travelAgenda.dailyTrips = dailyTrip.travelAgenda.dailyTrips.filter(trip => trip.id !== dailyTrip.id);

        dailyTrip.travelViewPoints.forEach(tvp => {
            this.deleteTravelViewPointAction(tvp.id, translateTravelViewPointFromBiz(tvp));
        });

        this.deleteDailyTripAction(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));

        this.updateTravelAgendaAction(dailyTrip.travelAgenda.id, translateTravelAgendaFromBiz(dailyTrip.travelAgenda));
        this.addDirtyAction(dailyTrip.travelAgenda.id, DirtyTypeEnum.UPDATED);

        if (dailyTrip.travelAgenda.dailyTrips.length == 0)
            this.selectDailyTrip(null);
        else if (isCurrentSelect)
            this.selectDailyTrip(dailyTrip.travelAgenda.dailyTrips[0]);

        return dailyTrip.travelAgenda;
    }

    public swtichDailyTrip(travelAgenda: ITravelAgendaBiz) {
        this.updateTravelAgendaAction(travelAgenda.id, translateTravelAgendaFromBiz(travelAgenda));
        this.addDirtyAction(travelAgenda.id, DirtyTypeEnum.UPDATED);
    }

    public addTravelViewPoint(viewPoint: IViewPointBiz, dailyTrip: IDailyTripBiz): ITravelViewPointBiz {
        let added = createTravelViewPoint(viewPoint, dailyTrip);
        dailyTrip.travelViewPoints.push(added);
        caculateDistance(dailyTrip);

        this.insertTravelViewPointAction(added.id, translateTravelViewPointFromBiz(added));
        if (dailyTrip.travelViewPoints.length > 1)
            this.updateTravelViewPointAction(dailyTrip.travelViewPoints[dailyTrip.travelViewPoints.length - 2].id,
                translateTravelViewPointFromBiz(dailyTrip.travelViewPoints[dailyTrip.travelViewPoints.length - 2]));
        this.updateDailyTripAction(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));
        this.updateTravelAgendaAction(dailyTrip.travelAgenda.id, translateTravelAgendaFromBiz(dailyTrip.travelAgenda));
        this.addDirtyAction(dailyTrip.travelAgenda.id, DirtyTypeEnum.UPDATED);

        return added;
    }

    public removeTravelViewPoint(travelViewPoint: ITravelViewPointBiz) {
        this.deleteTravelViewPointAction(travelViewPoint.id, translateTravelViewPointFromBiz(travelViewPoint));
        this.updateDailyTripAction(travelViewPoint.dailyTrip.id, translateDailyTripFromBiz(travelViewPoint.dailyTrip));
        this.updateTravelAgendaAction(travelViewPoint.dailyTrip.travelAgenda.id, translateTravelAgendaFromBiz(travelViewPoint.dailyTrip.travelAgenda));
        this.addDirtyAction(travelViewPoint.dailyTrip.travelAgenda.id, DirtyTypeEnum.UPDATED);
    }

    public updateTraveViewPoint(travelViewPoint: ITravelViewPointBiz) {
        this.updateTravelViewPointAction(travelViewPoint.id, translateTravelViewPointFromBiz(travelViewPoint));
        this.updateDailyTripAction(travelViewPoint.dailyTrip.id, translateDailyTripFromBiz(travelViewPoint.dailyTrip));
        this.updateTravelAgendaAction(travelViewPoint.dailyTrip.travelAgenda.id, translateTravelAgendaFromBiz(travelViewPoint.dailyTrip.travelAgenda));
        this.addDirtyAction(travelViewPoint.dailyTrip.travelAgenda.id, DirtyTypeEnum.UPDATED);
    }

    public switchTravelViewPoint(dailyTrip: IDailyTripBiz) {
        caculateDistance(dailyTrip);

        dailyTrip.travelViewPoints.forEach((tvp) => {
            this.updateTravelViewPointAction(tvp.id, translateTravelViewPointFromBiz(tvp));
        });
        this.updateDailyTripAction(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));
        this.updateTravelAgendaAction(dailyTrip.travelAgenda.id, translateTravelAgendaFromBiz(dailyTrip.travelAgenda));
        this.addDirtyAction(dailyTrip.travelAgenda.id, DirtyTypeEnum.UPDATED);
    }

    public publish() {
        this.flushDirtyAction();
    }

    //#endregion
}