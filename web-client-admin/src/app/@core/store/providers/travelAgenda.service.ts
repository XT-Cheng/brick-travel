import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { denormalize } from 'normalizr';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { FILE_UPLOADER } from '../../fileUpload/fileUpload.module';
import { FileUploader } from '../../fileUpload/providers/file-uploader';
import {
    ITransportationCategoryBiz,
    ITravelAgendaBiz,
    translateTravelAgendaFromBiz,
} from '../bizModel/model/travelAgenda.biz.model';
import { EntityTypeEnum, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { transportationCategory, travelAgenda } from '../entity/entity.schema';
import { ITravelAgenda } from '../entity/model/travelAgenda.model';
import { IAppState, STORE_KEY } from '../store.model';
import { EntityService } from './entity.service';

@Injectable()
export class TravelAgendaService extends EntityService<ITravelAgenda, ITravelAgendaBiz> {
    //#region private member

    private _travelAgendaSelector$: BehaviorSubject<ITravelAgendaBiz[]> = new BehaviorSubject([]);
    private _transportationCategorySelector$: BehaviorSubject<ITransportationCategoryBiz[]> = new BehaviorSubject([]);

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>) {
        super(_http, _uploader, _store, EntityTypeEnum.TRAVELAGENDA, [travelAgenda], `travelAgendas`);

        this.getTravelAgendas(this._store).subscribe((value) => {
            this._travelAgendaSelector$.next(value);
        });

        this.getTransportationCategories(this._store).subscribe((value) => {
            this._transportationCategorySelector$.next(value);
        });
    }
    //#endregion

    //#region public methods
    public get travelAgendas$(): Observable<ITravelAgendaBiz[]> {
        return this._travelAgendaSelector$.asObservable();
    }

    public get transportationCategories$(): Observable<ITransportationCategoryBiz[]> {
        return this._transportationCategorySelector$.asObservable();
    }
    //#region CRUD methods

    public fetch() {
        this.loadEntities();
    }

    public add(c: ITravelAgendaBiz) {
        this.insertEntity(translateTravelAgendaFromBiz(c));
    }

    public change(c: ITravelAgendaBiz) {
        this.updateEntity(translateTravelAgendaFromBiz(c));
    }

    public remove(c: ITravelAgendaBiz) {
        this.deleteEntity(translateTravelAgendaFromBiz(c));
    }

    //#endregion

    //#endregion

    //#region Entities Selector

    private getTravelAgendas(store: NgRedux<IAppState>): Observable<ITravelAgendaBiz[]> {
        return store.select<{ [id: string]: ITravelAgenda }>([STORE_KEY.entities, STORE_ENTITIES_KEY.travelAgendas]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [travelAgenda], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    private getTransportationCategories(store: NgRedux<IAppState>): Observable<ITransportationCategoryBiz[]> {
        return store.select<{ [id: string]: ITransportationCategoryBiz }>([STORE_KEY.entities, STORE_ENTITIES_KEY.transportationCatgories])
            .pipe(
                map((data) => {
                    return denormalize(Object.keys(data), [transportationCategory],
                        Immutable(store.getState().entities).asMutable({ deep: true }));
                })
            );
    }
    //#endregion
}
