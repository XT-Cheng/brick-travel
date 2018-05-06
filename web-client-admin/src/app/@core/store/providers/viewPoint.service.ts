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
import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
import { EntityTypeEnum, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { viewPointSchema } from '../entity/entity.schema';
import { IViewPoint } from '../entity/model/viewPoint.model';
import { IAppState, STORE_KEY } from '../store.model';
import { STORE_UI_COMMON_KEY, STORE_UI_KEY } from '../ui/ui.model';
import { EntityService } from './entity.service';
import { ViewPointUIService } from './viewPoint.ui.service';

@Injectable()
export class ViewPointService extends EntityService<IViewPoint, IViewPointBiz> {
    //#region private member

    private _all$: BehaviorSubject<IViewPointBiz[]> = new BehaviorSubject([]);

    private _selected: IViewPointBiz;
    private _selected$: BehaviorSubject<IViewPointBiz> = new BehaviorSubject(null);

    private _searched: IViewPointBiz[];
    private _searched$: BehaviorSubject<IViewPointBiz[]> = new BehaviorSubject(null);

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>, private _viewPointUISrv: ViewPointUIService) {
        super(_http, _uploader, _store, EntityTypeEnum.VIEWPOINT, [viewPointSchema], `viewPoints`);

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
    protected toTransfer(bizModel: IViewPointBiz) {
        return Object.assign({}, bizModel, {
            city: bizModel.city.id
        });
    }
    //#endregion

    //#region public methods
    public get selected$(): Observable<IViewPointBiz> {
        return this._selected$.asObservable();
    }

    public get selected(): IViewPointBiz {
        return this._selected;
    }

    public get searched$(): Observable<IViewPointBiz[]> {
        return this._searched$.asObservable();
    }

    public get all$(): Observable<IViewPointBiz[]> {
        return this._all$.asObservable();
    }

    public byId(id: string): IViewPointBiz {
        return denormalize(id, viewPointSchema, Immutable(this._store.getState().entities).asMutable({ deep: true }));
    }

    //#region CRUD methods

    public fetch() {
        this.loadEntities();
    }

    public add(c: IViewPointBiz) {
        this.insertEntity(c);
    }

    public change(c: IViewPointBiz) {
        this.updateEntity(c);
    }

    public remove(c: IViewPointBiz) {
        this.deleteEntity(c);
    }

    //#endregion

    //#endregion

    //#region Entities Selector

    private getSelectedId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.viewPoint, STORE_UI_COMMON_KEY.selectedId]);
    }

    private getSelected(store: NgRedux<IAppState>): Observable<IViewPointBiz> {
        return this.getSelectedId(store).pipe(
            switchMap(id => {
                return store.select<IViewPoint>([STORE_KEY.entities, STORE_ENTITIES_KEY.viewPoints, id]);
            }),
            map(ct => {
                return ct ? denormalize(ct.id, viewPointSchema, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
            })
        );
    }

    private getSearched(store: NgRedux<IAppState>): Observable<IViewPointBiz[]> {
        return this.all$.pipe(
            combineLatest(this._viewPointUISrv.searchKey$, (viewPoints, searchKey) => {
                return viewPoints.filter(v => {
                    let matchSearchKey = true;
                    if (searchKey !== '') {
                        matchSearchKey = v.name.indexOf(searchKey) !== -1;
                    }

                    return matchSearchKey;
                });
            })
        );
    }

    private getAll(store: NgRedux<IAppState>): Observable<IViewPointBiz[]> {
        return store.select<{ [id: string]: IViewPoint }>([STORE_KEY.entities, STORE_ENTITIES_KEY.viewPoints]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [viewPointSchema], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    //#endregion
}
