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
import { IViewPointCategoryBiz, translateViewPointCategoryFromBiz } from '../bizModel/model/viewPoint.biz.model';
import { EntityTypeEnum, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { viewPointCategory } from '../entity/entity.schema';
import { IViewPointCategory } from '../entity/model/viewPoint.model';
import { IAppState, STORE_KEY } from '../store.model';
import { EntityService } from './entity.service';

@Injectable()
export class ViewPointCategoryService extends EntityService<IViewPointCategory, IViewPointCategoryBiz> {
    //#region private member

    private _all$: BehaviorSubject<IViewPointCategoryBiz[]> = new BehaviorSubject([]);

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>) {
        super(_http, _uploader, _store, EntityTypeEnum.VIEWPOINTCATEGORY, [viewPointCategory], `viewPointCategories`);

        this.getAll(this._store).subscribe((value) => {
            this._all$.next(value);
        });
    }
    //#endregion

    //#region public methods
    public get all$(): Observable<IViewPointCategoryBiz[]> {
        return this._all$.asObservable();
    }

    //#region CRUD methods

    public fetch() {
        this.loadEntities();
    }

    public add(c: IViewPointCategoryBiz) {
        this.insertEntity(translateViewPointCategoryFromBiz(c));
    }

    public change(c: IViewPointCategoryBiz) {
        this.updateEntity(translateViewPointCategoryFromBiz(c));
    }

    public remove(c: IViewPointCategoryBiz) {
        this.deleteEntity(translateViewPointCategoryFromBiz(c));
    }

    //#endregion

    //#endregion

    //#region Entities Selector

    private getAll(store: NgRedux<IAppState>): Observable<IViewPointCategoryBiz[]> {
        return store.select<{ [id: string]: IViewPointCategory }>([STORE_KEY.entities, STORE_ENTITIES_KEY.viewPointCatgories]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [viewPointCategory], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    //#endregion
}
