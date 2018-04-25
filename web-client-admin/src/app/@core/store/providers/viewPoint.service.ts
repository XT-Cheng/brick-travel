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
import { IViewPointBiz, translateViewPointFromBiz } from '../bizModel/model/viewPoint.biz.model';
import { STORE_ENTITIES_KEY } from '../entity/entity.model';
import { viewPoint } from '../entity/entity.schema';
import { IViewPoint } from '../entity/model/viewPoint.model';
import { IAppState, STORE_KEY } from '../store.model';
import { EntityTypeEnum } from '../store.module';
import { EntityService } from './entity.service';

@Injectable()
export class ViewPointService extends EntityService<IViewPoint, IViewPointBiz> {
    //#region private member

    private _viewPointSelector$: BehaviorSubject<IViewPointBiz[]> = new BehaviorSubject([]);

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>) {
        super(_http, _uploader, _store, EntityTypeEnum.VIEWPOINT, viewPoint, `viewPoints`);

        this.getViewPoints(this._store).subscribe((value) => {
            this._viewPointSelector$.next(value);
        });
    }
    //#endregion

    //#region public methods
    public get viewPoints$(): Observable<IViewPointBiz[]> {
        return this._viewPointSelector$.asObservable();
    }

    //#region CRUD methods

    public fetch() {
        this.loadEntities();
    }

    public add(c: IViewPointBiz) {
        this.insertEntity(translateViewPointFromBiz(c));
    }

    public change(c: IViewPointBiz) {
        this.updateEntity(translateViewPointFromBiz(c));
    }

    public remove(c: IViewPointBiz) {
        this.deleteEntity(translateViewPointFromBiz(c));
    }

    //#endregion

    //#endregion

    //#region Entities Selector

    private getViewPoints(store: NgRedux<IAppState>): Observable<IViewPointBiz[]> {
        return store.select<{ [id: string]: IViewPoint }>([STORE_KEY.entities, STORE_ENTITIES_KEY.viewPoints]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [viewPoint], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    //#endregion
}
