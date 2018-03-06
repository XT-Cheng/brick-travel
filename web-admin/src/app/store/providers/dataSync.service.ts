import { dispatch, NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MiddlewareAPI } from 'redux';
import { Epic } from 'redux-observable';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import {
    DirtyAction,
    DirtyActionPhaseEnum,
    DirtyActionTypeEnum,
    dirtyAddAction,
    dirtyFlushAction,
    dirtyFlushActionFailed,
    dirtyFlushActionFinished,
    dirtyFlushActionStarted,
    dirtyRemoveAction,
    DirtyTypeEnum,
} from '../dirty/dirty.action';
import { EntityTypeEnum, getEntityType } from '../entity/entity.action';
import { IAppState } from '../store.model';
import { TravelAgendaService } from './travelAgenda.service';
import { CityService } from './city.service';

@Injectable()
export class DataSyncService {
    private _sub: Subscription;
    private _stateRestored$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

    //#region Actions

    private flushDirtyStartedAction = dirtyFlushActionStarted();

    private flushDirtyFinishedAction = dirtyFlushActionFinished();

    private flushDirtyFailedAction = dirtyFlushActionFailed();

    @dispatch()
    private flushDirtyAction = dirtyFlushAction();

    //#endregion

    //#region Constructor
    constructor(private _travelAgendaService: TravelAgendaService,private _cityService : CityService,
        private _storage: Storage, private _store: NgRedux<IAppState>) {
    }
    //#endregion

    //#region Epic
    public createEpic() {
        return this.createFlushEpic();
    }

    public createFlushEpic(): Epic<DirtyAction, IAppState> {
        return (action$, store) => action$
            .ofType(DirtyActionTypeEnum.FLUSH)
            .filter(action => action.meta.phaseType == DirtyActionPhaseEnum.TRIGGER)
            .switchMap(action => this.flush(store)
                .mergeMap((value: { entityType: EntityTypeEnum, type: DirtyTypeEnum, id: string }) =>
                    this.requestFlush(value)
                        .map(data => {
                            //Do nothing while succeed.
                            return { type: 'empty', payload: null, meta: null };
                        })
                        .catch(error =>
                            of(dirtyAddAction(value.entityType)(value.id, value.type))
                                .concat(of(this.flushDirtyFailedAction(error)))
                        )
                        .startWith(dirtyRemoveAction(value.entityType)(value.id, value.type)))
                .startWith(this.flushDirtyStartedAction())
                .concat(Observable.fromPromise(this.persistantState()).map(() => this.flushDirtyFinishedAction())));
    }
    //#endregion

    //#region Public methods
    public async restoreState() {
        let value = await this._storage.get('state');
        
        return value ? value : {};
    }

    public stateRestored() {
        this._stateRestored$.next(true);
    }
    public syncData() {
        this.flushDirtyAction();
    }
    
    public isStateRestored() : Observable<boolean> {
        return this._stateRestored$.filter(value => !!value).share();
    }

    //#endregion

    //#region Private methods    
    private async persistantState() {
        return await this._storage.set('state', this._store.getState())
    }

    private flush(store: MiddlewareAPI<IAppState>): Observable<any> {
        let ret: { entityType: EntityTypeEnum, type: DirtyTypeEnum, id: string }[] = [];

        Object.keys(store.getState().dirties.dirtyIds).forEach(key => {
            Object.keys(store.getState().dirties.dirtyIds[key]).forEach(dirtyType => {
                store.getState().dirties.dirtyIds[key][dirtyType].forEach(id => {
                    ret.push({ entityType: getEntityType(key), type: DirtyTypeEnum[dirtyType.toUpperCase()], id: id })
                });
            })
        })

        return Observable.of(...ret);
    }

    private requestFlush(value: { entityType: EntityTypeEnum, type: string, id: string }) {
        let { entityType, type, id } = value;
        switch (entityType) {
            case EntityTypeEnum.TRAVELAGENDA: {
                return this.requestFlushTravelAgenda(type, id);
            }
            case EntityTypeEnum.CITY: {
                return this.requestFlushCity(type, id);
            }
        }
    }

    private requestFlushTravelAgenda(type: string, id: string) {
        switch (type) {
            case DirtyTypeEnum.CREATED: {
                return this._travelAgendaService.insertTravelAgenda(id);
            }
            case DirtyTypeEnum.UPDATED: {
                return this._travelAgendaService.updateTravelAgenda(id);
            }
            case DirtyTypeEnum.DELETED: {
                return this._travelAgendaService.deleteTravelAgenda(id);
            }
        }
    }

    private requestFlushCity(type: string, id: string) {
        switch (type) {
            case DirtyTypeEnum.CREATED: {
                return this._cityService.insertCity(id);
            }
            case DirtyTypeEnum.UPDATED: {
                return this._cityService.updateCity(id);
            }
            case DirtyTypeEnum.DELETED: {
                return this._cityService.deleteCity(id);
            }
        }
    }
    //#endregion
}