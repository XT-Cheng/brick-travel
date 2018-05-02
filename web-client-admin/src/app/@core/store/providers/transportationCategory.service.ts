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
import { ITransportationCategoryBiz } from '../bizModel/model/travelAgenda.biz.model';
import { EntityTypeEnum, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { transportationCategory } from '../entity/entity.schema';
import { ITransportationCategory } from '../entity/model/travelAgenda.model';
import { IAppState, STORE_KEY } from '../store.model';
import { EntityService } from './entity.service';

@Injectable()
export class TransportationCategoryService extends EntityService<ITransportationCategory, ITransportationCategoryBiz> {
    //#region private member

    private _all$: BehaviorSubject<ITransportationCategoryBiz[]> = new BehaviorSubject([]);

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>) {
        super(_http, _uploader, _store, EntityTypeEnum.TRANSPORTATIONCATEGORY, [transportationCategory], `transportationCategories`);

        this.getAll(this._store).subscribe((value) => {
            this._all$.next(value);
        });
    }
    //#endregion

    //#region implemented methods
    protected toTransfer(bizModel: ITransportationCategoryBiz) {
        throw new Error('Method not implemented.');
    }
    //#endregion

    //#region public methods
    public get all$(): Observable<ITransportationCategoryBiz[]> {
        return this._all$.asObservable();
    }

    //#region CRUD methods

    public fetch() {
        this.loadEntities();
    }

    public add(c: ITransportationCategoryBiz) {
        this.insertEntity(c);
    }

    public change(c: ITransportationCategoryBiz) {
        this.updateEntity(c);
    }

    public remove(c: ITransportationCategoryBiz) {
        this.deleteEntity(c);
    }

    //#endregion

    //#endregion

    //#region Entities Selector

    private getAll(store: NgRedux<IAppState>): Observable<ITransportationCategoryBiz[]> {
        return store.select<{ [id: string]: ITransportationCategory }>(
            [STORE_KEY.entities, STORE_ENTITIES_KEY.transportationCatgories]).pipe(
                map((data) => {
                    return denormalize(Object.keys(data), [transportationCategory],
                        Immutable(store.getState().entities).asMutable({ deep: true }));
                })
            );
    }

    //#endregion
}
