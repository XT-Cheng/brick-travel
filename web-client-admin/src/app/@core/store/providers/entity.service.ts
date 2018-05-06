import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { normalize } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, concat, filter, map, mergeMap, startWith } from 'rxjs/operators';

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
        protected _entitySchema: any,
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
                        catchError(response =>
                            of(this.failedAction(<EntityActionTypeEnum>(action.type), response))
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
                        catchError(response => {
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
                                    this.failedAction(<EntityActionTypeEnum>(action.type), response))));
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
                return normalize(records, this._entitySchema).entities;
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
                return normalize(records, this._entitySchema).entities;
            })
        );
    }

    private delete(bizModel: U): Observable<IEntities> {
        const transfer = this.toTransfer(bizModel);
        return this._http.delete(`${WEBAPI_HOST}/${this._url}/${transfer.id}`).pipe(
            map(records => {
                return normalize(records, this._entitySchema).entities;
            })
        );
    }
    //#endregion
}
