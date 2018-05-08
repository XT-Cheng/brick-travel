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
import { IFilterCategoryBiz } from '../bizModel/model/filterCategory.biz.model';
import { EntityTypeEnum, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { filterCategorySchema } from '../entity/entity.schema';
import { IFilterCategory } from '../entity/model/filterCategory.model';
import { IAppState, STORE_KEY } from '../store.model';
import { EntityService } from './entity.service';

@Injectable()
export class FilterCategoryService extends EntityService<IFilterCategory, IFilterCategoryBiz> {
    //#region private member

    private _all$: BehaviorSubject<IFilterCategoryBiz[]> = new BehaviorSubject([]);

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>) {
        super(_http, _uploader, _store, EntityTypeEnum.FILTERCATEGORY, filterCategorySchema, `filterCategories`);

        this.getAll(this._store).subscribe((value) => {
            this._all$.next(value);
        });
    }
    //#endregion

    //#region implemented methods
    protected toTransfer(bizModel: IFilterCategoryBiz) {
        return bizModel;
    }
    //#endregion

    //#region public methods
    public get all$(): Observable<IFilterCategoryBiz[]> {
        return this._all$.asObservable();
    }

    public byId(id: string): IFilterCategoryBiz {
        return denormalize(id, filterCategorySchema, Immutable(this._store.getState().entities).asMutable({ deep: true }));
    }

    //#region CRUD methods

    public fetch() {
        this.loadEntities();
    }

    public add(c: IFilterCategoryBiz) {
        this.insertEntity(c);
    }

    public change(c: IFilterCategoryBiz) {
        this.updateEntity(c);
    }

    public remove(c: IFilterCategoryBiz) {
        this.deleteEntity(c);
    }

    public addById(id: string) {
        const toAdd = this.byId(id);
        if (!toAdd) { throw new Error(`City Id ${id} not exist!`); }

        this.add(toAdd);
    }

    public changeById(id: string) {
        const toChange = this.byId(id);
        if (!toChange) { throw new Error(`City Id ${id} not exist!`); }

        this.change(toChange);
    }

    public removeById(id: string) {
        const toRemove = this.byId(id);
        if (!toRemove) { throw new Error(`City Id ${id} not exist!`); }

        this.remove(toRemove);
    }

    //#endregion

    //#endregion

    //#region Entities Selector

    private getAll(store: NgRedux<IAppState>): Observable<IFilterCategoryBiz[]> {
        return store.select<{ [id: string]: IFilterCategory }>([STORE_KEY.entities, STORE_ENTITIES_KEY.filterCategories]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [filterCategorySchema],
                    Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    //#endregion
}
