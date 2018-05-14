import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MiddlewareAPI } from 'redux';
import { Epic } from 'redux-observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { concat, filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators';

import {
    DirtyAction,
    DirtyActionPhaseEnum,
    DirtyActionTypeEnum,
    dirtyFlushAction,
    dirtyFlushActionFailed,
    dirtyFlushActionFinished,
    dirtyFlushActionStarted,
    dirtyRemoveAction,
    DirtyTypeEnum,
} from '../dirty/dirty.action';
import { STORE_DIRTIES_KEY } from '../dirty/dirty.model';
import { getEntityType } from '../entity/entity.action';
import { EntityTypeEnum } from '../entity/entity.model';
import { IAppState, STORE_KEY } from '../store.model';
import { CityService } from './city.service';
import { TravelAgendaService } from './travelAgenda.service';

@Injectable()
export class DataFlushService {
    //#region private members

    private _dirtyIds$: BehaviorSubject<any> = new BehaviorSubject(null);
    private _stateRestored$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    //#endregion

    //#region Actions

    private flushDirtyStartedAction = dirtyFlushActionStarted();
    private flushDirtyFinishedAction = dirtyFlushActionFinished();
    private flushDirtyFailedAction = dirtyFlushActionFailed();
    private flushDirtyAction = dirtyFlushAction();

    //#endregion

    //#region Constructor
    constructor(private _travelAgendaService: TravelAgendaService, private _cityService: CityService,
        private _storage: Storage, private _store: NgRedux<IAppState>) {
        this.getDirtyIds(this._store).subscribe((value) => {
            this._dirtyIds$.next(value);
        });
    }
    //#endregion

    //#region Epic
    public createEpic(): any[] {
        return [this.createFlushEpic()];
    }

    private createFlushEpic(): Epic<DirtyAction, IAppState> {
        return (action$, store) => action$
            .ofType(DirtyActionTypeEnum.FLUSH).pipe(
                filter(action => action.payload.phaseType === DirtyActionPhaseEnum.TRIGGER),
                switchMap(action => this.requestFlush(store).pipe(
                    mergeMap((value: { entityType: EntityTypeEnum, type: DirtyTypeEnum, id: string }) => {
                        this.flushEntity(value);
                        return of(dirtyRemoveAction(value.entityType)(value.id, value.type)).pipe(
                            concat(of(this.flushDirtyFinishedAction())),
                            startWith(this.flushDirtyStartedAction())
                        );
                    }))));
    }
    //#endregion

    //#region Public methods
    public get dirtyIds$(): Observable<any> {
        return this._dirtyIds$.asObservable();
    }

    public flush() {
        this._store.dispatch(this.flushDirtyAction());
    }

    public async restoreState() {
        const value = await this._storage.get('state');

        this._stateRestored$.next(true);

        return value ? value : {};
    }

    public syncData() {
        this.flushDirtyAction();
    }

    public isStateRestored(): Observable<boolean> {
        return this._stateRestored$.pipe(filter(value => !!value));
    }
    //#endregion

    //#region Private methods
    private getDirtyIds(store: NgRedux<IAppState>): Observable<any> {
        return store.select<any>([STORE_KEY.dirties, STORE_DIRTIES_KEY.dirtyIds]).pipe(
            map((data) => {
                return data.asMutable({ deep: true });
            }));
    }

    private requestFlush(store: MiddlewareAPI<IAppState>): Observable<any> {
        const ret: { entityType: EntityTypeEnum, type: DirtyTypeEnum, id: string }[] = [];

        Object.keys(store.getState().dirties.dirtyIds).forEach(key => {
            Object.keys(store.getState().dirties.dirtyIds[key]).forEach(dirtyType => {
                store.getState().dirties.dirtyIds[key][dirtyType].forEach(id => {
                    ret.push({ entityType: getEntityType(key), type: DirtyTypeEnum[dirtyType.toUpperCase()], id: id });
                });
            });
        });

        return of(...ret);
    }

    private flushEntity(value: { entityType: EntityTypeEnum, type: string, id: string }) {
        const { entityType, type, id } = value;
        switch (entityType) {
            case EntityTypeEnum.TRAVELAGENDA: {
                this.requestFlushTravelAgenda(type, id);
                break;
            }
        }
    }

    private requestFlushTravelAgenda(type: string, id: string) {
        switch (type) {
            case DirtyTypeEnum.CREATED: {
                this._travelAgendaService.addById(id);
                break;
            }
            case DirtyTypeEnum.UPDATED: {
                this._travelAgendaService.changeById(id);
                break;
            }
            case DirtyTypeEnum.DELETED: {
                this._travelAgendaService.removeById(id);
                break;
            }
        }
    }

    //#endregion
}
