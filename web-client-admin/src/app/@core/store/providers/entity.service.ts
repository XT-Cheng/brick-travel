import { NgRedux } from '@angular-redux/store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { denormalize, normalize, schema } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, concat, filter, map, mergeMap, startWith } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { FileUploader } from '../../fileUpload/providers/file-uploader';
import { WEBAPI_HOST } from '../../utils/constants';
import { IBiz } from '../bizModel/biz.model';
import { dirtyAddAction, DirtyTypeEnum } from '../dirty/dirty.action';
import {
    EntityAction,
    EntityActionPhaseEnum,
    EntityActionTypeEnum,
    entityDeleteAction,
    entityInsertAction,
    entityUpdateAction,
    getEntityKey,
} from '../entity/entity.action';
import { EntityTypeEnum, IEntities, IEntity } from '../entity/entity.model';
import { IAppState } from '../store.model';
import { FetchService } from './fetch.service';

export abstract class EntityService<T extends IEntity, U extends IBiz> extends FetchService {

    //#region Constructor
    constructor(protected _http: HttpClient,
        protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>,
        protected _entityType: EntityTypeEnum,
        protected _entitySchema: schema.Entity,
        protected _url: string) {
        super(_http, _store, _entityType, _entitySchema, _url);
    }
    //#endregion

    //#region Actions

    //#region Entity Actions

    //#endregion

    //#region load actions

    //#endregion

    //#region update actions

    protected updateAction = entityUpdateAction<U>(this._entityType);

    //#endregion

    //#region insert actions

    protected insertAction = entityInsertAction<U>(this._entityType);

    //#endregion

    //#region delete actions

    protected deleteAction = entityDeleteAction<U>(this._entityType);

    //#endregion

    //#region dirty actions

    protected addDirtyAction = dirtyAddAction(this._entityType);

    //#endregion

    //#endregion

    //#region UI Actions

    //#endregion

    //#region Epic
    public createEpic(): Epic<EntityAction, IAppState>[] {
        return [...super.createEpic(), this.createEpicOfDML(), this.createEpicOfDMLForDirtyMode()];
    }

    private createEpicOfDML(): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.INSERT, EntityActionTypeEnum.DELETE, EntityActionTypeEnum.UPDATE).pipe(
                filter(action =>
                    action.payload.entityType === this._entityType
                    && action.payload.phaseType === EntityActionPhaseEnum.TRIGGER
                    && !action.payload.dirtyMode),
                mergeMap(action => {
                    const bizModel = <U>action.payload.bizModel;
                    let ret: Observable<IEntities>;
                    switch (action.type) {
                        case EntityActionTypeEnum.INSERT: {
                            ret = this.insert(bizModel);
                            break;
                        }
                        case EntityActionTypeEnum.DELETE: {
                            ret = this.delete(bizModel);
                            break;
                        }
                        case EntityActionTypeEnum.UPDATE: {
                            ret = this.update(bizModel);
                            break;
                        }
                    }
                    return ret.pipe(
                        map(data => this.succeededAction(<EntityActionTypeEnum>(action.type), data)),
                        catchError((errResponse: HttpErrorResponse) =>
                            of(this.failedAction(<EntityActionTypeEnum>(action.type), errResponse.error))
                        ),
                        startWith(this.startedAction(<EntityActionTypeEnum>(action.type))));
                }));
    }

    private createEpicOfDMLForDirtyMode(): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.INSERT, EntityActionTypeEnum.DELETE, EntityActionTypeEnum.UPDATE).pipe(
                filter(action =>
                    action.payload.entityType === this._entityType
                    && action.payload.phaseType === EntityActionPhaseEnum.TRIGGER
                    && action.payload.dirtyMode),
                mergeMap(action => {
                    const bizModel = <U>action.payload.bizModel;
                    let ret: Observable<IEntities>;
                    switch (action.type) {
                        case EntityActionTypeEnum.INSERT: {
                            ret = this.insert(bizModel);
                            break;
                        }
                        case EntityActionTypeEnum.DELETE: {
                            ret = this.delete(bizModel);
                            break;
                        }
                        case EntityActionTypeEnum.UPDATE: {
                            ret = this.update(bizModel);
                            break;
                        }
                    }
                    return ret.pipe(
                        map(data => this.succeededAction(<EntityActionTypeEnum>(action.type), data)),
                        catchError((errResponse: HttpErrorResponse) => {
                            let dirtyType: DirtyTypeEnum;
                            switch (action.type) {
                                case EntityActionTypeEnum.INSERT: {
                                    dirtyType = DirtyTypeEnum.CREATED;
                                    break;
                                }
                                case EntityActionTypeEnum.DELETE: {
                                    dirtyType = DirtyTypeEnum.DELETED;
                                    break;
                                }
                                case EntityActionTypeEnum.UPDATE: {
                                    dirtyType = DirtyTypeEnum.UPDATED;
                                    break;
                                }
                            }
                            return of(this.addDirtyAction(bizModel.id, dirtyType)).pipe(
                                concat(of(this.succeededAction(<EntityActionTypeEnum>(action.type), action.payload.entities),
                                    this.failedAction(<EntityActionTypeEnum>(action.type), errResponse.error))));
                        }),
                        startWith(this.startedAction(<EntityActionTypeEnum>(action.type))));
                }));
    }
    //#endregion

    //#region protected methods

    protected insertEntity(bizModel: U, dirtyMode: boolean = false) {
        this._store.dispatch(this.insertAction(bizModel.id, bizModel, dirtyMode));
    }

    protected updateEntity(bizModel: U, dirtyMode: boolean = false) {
        this._store.dispatch(this.updateAction(bizModel.id, bizModel, dirtyMode));
    }

    protected deleteEntity(bizModel: U, dirtyMode: boolean = false) {
        this._store.dispatch(this.deleteAction(bizModel.id, bizModel, dirtyMode));
    }

    protected abstract toTransfer(bizModel: U): any;

    //#endregion

    //#region private methods

    private insert(bizModel: U): Observable<IEntities> {
        const transfer = this.toTransfer(bizModel);

        const formData: FormData = new FormData();

        formData.append(getEntityKey(this._entityType), JSON.stringify(transfer));

        for (let i = 0; i < this._uploader.queue.length; i++) {
            formData.append(i.toString(), this._uploader.queue[i]._file, this._uploader.queue[i].file.name);
        }
        this._uploader.clearQueue();

        return this._http.post(`${WEBAPI_HOST}/${this._url}`, formData).pipe(
            map(records => {
                return normalize(records, [this.schema]).entities;
            })
        );
    }

    private update(bizModel: U): Observable<IEntities> {
        const transfer = this.toTransfer(bizModel);

        const formData: FormData = new FormData();

        formData.append(getEntityKey(this._entityType), JSON.stringify(transfer));
        for (let i = 0; i < this._uploader.queue.length; i++) {
            formData.append(i.toString(), this._uploader.queue[i]._file, this._uploader.queue[i].file.name);
        }
        this._uploader.clearQueue();

        return this._http.put(`${WEBAPI_HOST}/${this._url}`, formData).pipe(
            map(records => {
                return normalize(records, [this.schema]).entities;
            })
        );
    }

    private delete(bizModel: U): Observable<IEntities> {
        const transfer = this.toTransfer(bizModel);
        return this._http.delete(`${WEBAPI_HOST}/${this._url}/${transfer.id}`).pipe(
            map(records => {
                return normalize(records, [this.schema]).entities;
            })
        );
    }
    //#endregion

    //#region Public methdos
    public fetch() {
        this.loadEntities();
    }

    public add(biz: U) {
        this.insertEntity(biz);
    }

    public change(biz: U) {
        this.updateEntity(biz);
    }

    public remove(biz: U) {
        this.deleteEntity(biz);
    }

    public addById(id: string) {
        const toAdd = this.byId(id);
        if (!toAdd) { throw new Error(`${this._entityType} Id ${id} not exist!`); }

        this.add(toAdd);
    }

    public changeById(id: string) {
        const toChange = this.byId(id);
        if (!toChange) { throw new Error(`${this._entityType} Id ${id} not exist!`); }

        this.change(toChange);
    }

    public removeById(id: string) {
        const toRemove = this.byId(id);
        if (!toRemove) { throw new Error(`${this._entityType} Id ${id} not exist!`); }

        this.remove(toRemove);
    }

    public byId(id: string): U {
        return denormalize(id, this.schema, Immutable(this._store.getState().entities).asMutable({ deep: true }));
    }
    //#endregion
}
