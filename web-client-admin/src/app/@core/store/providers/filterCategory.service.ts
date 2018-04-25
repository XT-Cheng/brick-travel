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
import { IFilterCategoryBiz, translateFilterCategoryFromBiz } from '../bizModel/model/filterCategory.biz.model';
import { EntityTypeEnum, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { filterCategory } from '../entity/entity.schema';
import { IFilterCategory } from '../entity/model/filterCategory.model';
import { IAppState, STORE_KEY } from '../store.model';
import { EntityService } from './entity.service';

@Injectable()
export class FilterCategoryService extends EntityService<IFilterCategory, IFilterCategoryBiz> {
    //#region private member

    private _filterCategoriesSelector$: BehaviorSubject<IFilterCategoryBiz[]> = new BehaviorSubject([]);

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>) {
        super(_http, _uploader, _store, EntityTypeEnum.FILTERCATEGORY, [filterCategory], `filterCategories`);

        this.getFilterCategories(this._store).subscribe((value) => {
            this._filterCategoriesSelector$.next(value);
        });
    }
    //#endregion

    //#region public methods
    public get filterCategories$(): Observable<IFilterCategoryBiz[]> {
        return this._filterCategoriesSelector$.asObservable();
    }

    //#region CRUD methods

    public fetch() {
        this.loadEntities();
    }

    public add(c: IFilterCategoryBiz) {
        this.insertEntity(translateFilterCategoryFromBiz(c));
    }

    public change(c: IFilterCategoryBiz) {
        this.updateEntity(translateFilterCategoryFromBiz(c));
    }

    public remove(c: IFilterCategoryBiz) {
        this.deleteEntity(translateFilterCategoryFromBiz(c));
    }

    //#endregion

    //#endregion

    //#region Entities Selector

    private getFilterCategories(store: NgRedux<IAppState>): Observable<IFilterCategoryBiz[]> {
        return store.select<{ [id: string]: IFilterCategory }>([STORE_KEY.entities, STORE_ENTITIES_KEY.filterCategories]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [filterCategory], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    //#endregion
}
