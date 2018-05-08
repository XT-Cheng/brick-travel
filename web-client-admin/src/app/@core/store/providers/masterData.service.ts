import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EntityTypeEnum } from '../entity/entity.model';
import { citySchema, transportationCategorySchema, viewPointCategorySchema } from '../entity/entity.schema';
import { IAppState } from '../store.model';
import { FetchService } from './fetch.service';

@Injectable()
export class MasterDataService extends FetchService {
    //#region private member

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        protected _store: NgRedux<IAppState>) {
        super(_http, _store, EntityTypeEnum.MASTER_DATA, {
            viewPointCategories: [viewPointCategorySchema],
            transportationCategories: [transportationCategorySchema],
            cities: [citySchema]
        }, `masterData`);
    }
    //#endregion

    //#region public methods

    //#region CRUD methods

    public fetch() {
        this.loadEntities();
    }

    //#endregion

    //#endregion

    //#region protected methods

    //#endregion

    //#region Entities Selector

    //#endregion
}
