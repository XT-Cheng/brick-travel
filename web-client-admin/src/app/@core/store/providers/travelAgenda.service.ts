import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { denormalize, normalize } from 'normalizr';
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
    newDailiyTrip,
    newTravelViewPoint,
} from '../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
import { DirtyTypeEnum } from '../dirty/dirty.action';
import { EntityActionTypeEnum } from '../entity/entity.action';
import { EntityTypeEnum, INIT_ENTITY_STATE, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { dailyTripSchema, travelAgendaSchema, travelViewPointSchema } from '../entity/entity.schema';
import { ITravelAgenda } from '../entity/model/travelAgenda.model';
import { IAppState, STORE_KEY } from '../store.model';
import { STORE_UI_COMMON_KEY, STORE_UI_KEY } from '../ui/ui.model';
import { EntityService } from './entity.service';
import { TransportationCategoryService } from './transportationCategory.service';
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
    // private insertDataAction = entityActionSucceeded(EntityTypeEnum.TRAVELAGENDA);

    //#endregion

    //#region insert actions

    // private updateDataAction = entityActionSucceeded(EntityTypeEnum.TRAVELAGENDA);

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient, private _transportationCategoryService: TransportationCategoryService,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader, private _travelAgendaUISrv: TravelAgendaUIService,
        protected _store: NgRedux<IAppState>) {
        super(_http, _uploader, _store, EntityTypeEnum.TRAVELAGENDA, travelAgendaSchema, `travelAgendas`);

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

    //#region implemented methods
    public toTransfer(bizModel: ITravelAgendaBiz) {
        return {
            id: bizModel.id,
            name: bizModel.name,
            user: bizModel.user,
            cover: bizModel.cover,
            dailyTrips: bizModel.dailyTrips.map(dailyTrip => {
                return {
                    id: dailyTrip.id,
                    travelAgenda: bizModel.id,
                    lastViewPoint: dailyTrip.lastViewPoint ? dailyTrip.lastViewPoint.id : null,
                    travelViewPoints: dailyTrip.travelViewPoints.map(travelViewPoint => {
                        return {
                            id: travelViewPoint.id,
                            dailyTrip: dailyTrip.id,
                            viewPoint: travelViewPoint.viewPoint.id,
                            distanceToNext: travelViewPoint.distanceToNext,
                            transportationToNext: travelViewPoint.transportationToNext ? travelViewPoint.transportationToNext.id : null
                        };
                    })
                };
            })
        };
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
        return denormalize(id, travelAgendaSchema, Immutable(this._store.getState().entities).asMutable({ deep: true }));
    }

    public dailyTripById(id: string): IDailyTripBiz {
        return denormalize(id, dailyTripSchema, Immutable(this._store.getState().entities).asMutable({ deep: true }));
    }

    public travelViewPointById(id: string): ITravelViewPointBiz {
        return denormalize(id, travelViewPointSchema, Immutable(this._store.getState().entities).asMutable({ deep: true }));
    }

    public get all$(): Observable<ITravelAgendaBiz[]> {
        return this._all$.asObservable();
    }

    //#region CRUD methods
    public add(travelAgenda: ITravelAgendaBiz) {
        this.insertEntity(travelAgenda, true);
    }

    public change(travelAgenda: ITravelAgendaBiz) {
        this.updateEntity(travelAgenda, true);
    }

    public remove(travelAgenda: ITravelAgendaBiz) {
        this.deleteEntity(travelAgenda, true);
    }

    public addTravelViewPoint(viewPoint: IViewPointBiz, dailyTripId: string) {
        const dailyTrip = this.dailyTripById(dailyTripId);
        if (!dailyTrip) { throw new Error(`DailyTrip Id ${dailyTripId} not exist!`); }

        const travelViewPoint = newTravelViewPoint(viewPoint, dailyTrip);
        dailyTrip.travelViewPoints.push(travelViewPoint);

        this.caculateDistance(dailyTrip);

        travelViewPoint.dailyTrip = dailyTrip;
        const entities = normalize(this.toTransfer(dailyTrip.travelAgenda), travelAgendaSchema).entities;

        this._store.dispatch(this.succeededAction(
            EntityActionTypeEnum.UPDATE,
            Object.assign({}, INIT_ENTITY_STATE, entities)
        ));
        this._store.dispatch(this.addDirtyAction(dailyTrip.travelAgenda.id, DirtyTypeEnum.UPDATED));
    }

    public addDailyTrip(travelAgendaId: string) {
        const travelAgenda = this.byId(travelAgendaId);
        if (!travelAgenda) { throw new Error(`TravelAgenda Id ${travelAgendaId} not exist!`); }

        const dailyTrip = newDailiyTrip(travelAgenda);
        travelAgenda.dailyTrips.push(dailyTrip);

        this.caculateDistance(travelAgenda.dailyTrips[travelAgenda.dailyTrips.length - 1]);

        const entities = normalize(this.toTransfer(travelAgenda), travelAgendaSchema).entities;

        this._store.dispatch(this.succeededAction(
            EntityActionTypeEnum.UPDATE,
            Object.assign({}, INIT_ENTITY_STATE, entities)
        ));
        this._store.dispatch(this.addDirtyAction(travelAgenda.id, DirtyTypeEnum.UPDATED));
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
            map(travelAgenda => {
                return travelAgenda ? denormalize(travelAgenda.id, travelAgendaSchema,
                    Immutable(store.getState().entities).asMutable({ deep: true })) : null;
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
                return denormalize(Object.keys(data), [travelAgendaSchema],
                    Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    private caculateDistance(dailyTrip: IDailyTripBiz) {
        for (let i = 0; i < dailyTrip.travelViewPoints.length; i++) {
            const vp = dailyTrip.travelViewPoints[i];
            const vpNext = dailyTrip.travelViewPoints[i + 1];

            if (vpNext) {
                vp.distanceToNext = Math.round(new AMap.LngLat(vp.viewPoint.longtitude, vp.viewPoint.latitude).distance(
                    new AMap.LngLat(vpNext.viewPoint.longtitude, vpNext.viewPoint.latitude)
                ));

                if (vp.transportationToNext === null) {
                    vp.transportationToNext = this._transportationCategoryService.default;
                }
            } else {
                vp.distanceToNext = -1;
                vp.transportationToNext = null;
            }
        }

        if (dailyTrip.travelViewPoints.length > 0) {
            dailyTrip.travelViewPoints[dailyTrip.travelViewPoints.length - 1].transportationToNext = null;
            dailyTrip.lastViewPoint = dailyTrip.travelViewPoints[dailyTrip.travelViewPoints.length - 1];
        } else {
            dailyTrip.lastViewPoint = null;
        }
    }


    //#endregion
}
