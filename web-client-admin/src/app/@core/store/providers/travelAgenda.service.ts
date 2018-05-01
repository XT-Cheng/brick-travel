import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { denormalize } from 'normalizr';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest, map, switchMap } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { FILE_UPLOADER } from '../../fileUpload/fileUpload.module';
import { FileUploader } from '../../fileUpload/providers/file-uploader';
import {
    IDailyTripBiz,
    ITravelAgendaBiz,
    ITravelViewPointBiz,
    translateDailyTripFromBiz,
    translateTravelAgendaFromBiz,
    translateTravelViewPointFromBiz,
} from '../bizModel/model/travelAgenda.biz.model';
import { entityActionSucceeded, EntityActionTypeEnum, getEntityKey } from '../entity/entity.action';
import { EntityTypeEnum, INIT_ENTITY_STATE, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { travelAgenda } from '../entity/entity.schema';
import { ITravelAgenda } from '../entity/model/travelAgenda.model';
import { IAppState, STORE_KEY } from '../store.model';
import { STORE_UI_COMMON_KEY, STORE_UI_KEY } from '../ui/ui.model';
import { EntityService } from './entity.service';
import { TravelAgendaUIService } from './travelAgenda.ui.service';

@Injectable()
export class TravelAgendaService extends EntityService<ITravelAgenda, ITravelAgendaBiz> {
    //#region private member

    private _all$: BehaviorSubject<ITravelAgendaBiz[]> = new BehaviorSubject([]);

    private _selected: ITravelAgendaBiz;
    private _selected$: BehaviorSubject<ITravelAgendaBiz> = new BehaviorSubject(null);

    private _searched: ITravelAgendaBiz[];
    private _searched$: BehaviorSubject<ITravelAgendaBiz[]> = new BehaviorSubject(null);

    //#endregion

    //#region insert actions
    private insertDataAction = entityActionSucceeded(EntityTypeEnum.TRAVELAGENDA);

    //#endregion

    //#region insert actions

    private updateDataAction = entityActionSucceeded(EntityTypeEnum.TRAVELAGENDA);

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader, private _travelAgendaUISrv: TravelAgendaUIService,
        protected _store: NgRedux<IAppState>) {
        super(_http, _uploader, _store, EntityTypeEnum.TRAVELAGENDA, [travelAgenda], `travelAgendas`);

        this.getSelected(this._store).subscribe((value) => {
            this._selected = value;
            this._selected$.next(value);
        });

        this.getSearched(this._store).subscribe((value) => {
            this._searched$.next(value);
        });

        this.getAll(this._store).subscribe((value) => {
            this._all$.next(value);
        });
    }
    //#endregion

    //#region public methods
    public get selected$(): Observable<ITravelAgendaBiz> {
        return this._selected$.asObservable();
    }

    public get selected(): ITravelAgendaBiz {
        return this._selected;
    }

    public get searched$(): Observable<ITravelAgendaBiz[]> {
        return this._searched$.asObservable();
    }

    public byId(id: string): ITravelAgendaBiz {
        return denormalize(id, travelAgenda, Immutable(this._store.getState().entities).asMutable({ deep: true }));
    }

    public get all$(): Observable<ITravelAgendaBiz[]> {
        return this._all$.asObservable();
    }

    //#region CRUD methods

    public fetch() {
        this.loadEntities();
    }

    public add(c: ITravelAgendaBiz) {
        this.insertEntity(translateTravelAgendaFromBiz(c));
    }

    public addById(id: string) {
        const toAdd = this.byId(id);
        if (!toAdd) { throw new Error(`TravelAgenda Id ${id} not exist!`); }

        this.add(toAdd);
    }

    public addViewPoint(s: ITravelViewPointBiz, d: IDailyTripBiz) {
        d.travelViewPoints.push(s);

        this._store.dispatch(this.insertDataAction(
            EntityActionTypeEnum.INSERT,
            Object.assign({}, INIT_ENTITY_STATE, {
                [getEntityKey(EntityTypeEnum.TRAVELVIEWPOINT)]: {
                    [s.id]: translateTravelViewPointFromBiz(s)
                }
            })
        ));
        this._store.dispatch(this.updateDataAction(
            EntityActionTypeEnum.UPDATE,
            Object.assign({}, INIT_ENTITY_STATE, {
                [getEntityKey(EntityTypeEnum.DAILYTRIP)]: {
                    [d.id]: translateDailyTripFromBiz(d)
                }
            })
        ));
    }

    public addDailyTrip(s: IDailyTripBiz, d: ITravelAgendaBiz) {
        d.dailyTrips.push(s);
        this._store.dispatch(this.updateDataAction(
            EntityActionTypeEnum.UPDATE,
            Object.assign({}, INIT_ENTITY_STATE, {
                [getEntityKey(EntityTypeEnum.DAILYTRIP)]: {
                    [d.id]: translateTravelAgendaFromBiz(d)
                }
            })
        ));
        this._store.dispatch(this.insertDataAction(
            EntityActionTypeEnum.INSERT,
            Object.assign({}, INIT_ENTITY_STATE, {
                [getEntityKey(EntityTypeEnum.DAILYTRIP)]: {
                    [s.id]: translateDailyTripFromBiz(s)
                }
            })
        ));
    }

    public change(c: ITravelAgendaBiz) {
        this.updateEntity(translateTravelAgendaFromBiz(c));
    }

    public changeById(id: string) {
        const toChange = this.byId(id);
        if (!toChange) { throw new Error(`TravelAgenda Id ${id} not exist!`); }

        this.change(toChange);
    }

    public remove(c: ITravelAgendaBiz) {
        this.deleteEntity(translateTravelAgendaFromBiz(c));
    }

    public removeById(id: string) {
        const toRemove = this.byId(id);
        if (!toRemove) { throw new Error(`TravelAgenda Id ${id} not exist!`); }

        this.remove(toRemove);
    }

    //#endregion

    //#endregion

    //#region Entities Selector
    private getSelectedId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.travelAgenda, STORE_UI_COMMON_KEY.selectedId]);
    }

    private getSelected(store: NgRedux<IAppState>): Observable<ITravelAgendaBiz> {
        return this.getSelectedId(store).pipe(
            switchMap(id => {
                return store.select<ITravelAgenda>([STORE_KEY.entities, STORE_ENTITIES_KEY.travelAgendas, id]);
            }),
            map(ct => {
                return ct ? denormalize(ct.id, travelAgenda, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
            })
        );
    }

    private getSearched(store: NgRedux<IAppState>): Observable<ITravelAgendaBiz[]> {
        return this.all$.pipe(
            combineLatest(this._travelAgendaUISrv.searchKey$, (travelAgendas, searchKey) => {
                return travelAgendas.filter(v => {
                    let matchSearchKey = true;
                    if (searchKey !== '') {
                        matchSearchKey = v.name.indexOf(searchKey) !== -1;
                    }

                    return matchSearchKey;
                });
            })
        );
    }

    private getAll(store: NgRedux<IAppState>): Observable<ITravelAgendaBiz[]> {
        return store.select<{ [id: string]: ITravelAgenda }>([STORE_KEY.entities, STORE_ENTITIES_KEY.travelAgendas]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [travelAgenda], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    //#endregion
}
