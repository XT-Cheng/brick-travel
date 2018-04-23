import { dispatch, NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { denormalize, normalize, schema } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { FileUploader } from '../../fileUpload/providers/file-uploader';
import { WEBAPI_HOST } from '../../utils/constants';
import { IBiz } from '../bizModel/biz.model';
import {
    EntityAction,
    entityActionFailed,
    EntityActionPhaseEnum,
    entityActionStarted,
    entityActionSucceeded,
    EntityActionTypeEnum,
    entityDeleteAction,
    entityInsertAction,
    entityLoadAction,
    entityUpdateAction,
    getEntityKey,
    IPagination,
    IQueryCondition,
} from '../entity/entity.action';
import { IEntities, IEntity } from '../entity/entity.model';
import { IAppState } from '../store.model';
import { EntityTypeEnum } from '../store.module';

export abstract class EntityService<T extends IEntity, U extends IBiz> {
    private DEFAULT_PAGE = 0;
    private DEFAULT_LIMIT = 50;

    //#region Constructor
    constructor(protected _http: HttpClient,
        protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>,
        protected _entityType: EntityTypeEnum,
        protected _entitySchema: schema.Entity,
        protected _url: string) {
    }
    //#endregion

    //#region Actions

    //#region Entity Actions

    protected startedAction = entityActionStarted(this._entityType);

    protected succeededAction = entityActionSucceeded(this._entityType);

    protected failedAction = entityActionFailed(this._entityType);

    //#endregion

    //#region load actions

    @dispatch()
    protected loadAction = entityLoadAction(this._entityType);

    //#endregion

    //#region update actions

    @dispatch()
    private updateAction = entityUpdateAction<T>(this._entityType);

    //#endregion

    //#region insert actions

    @dispatch()
    private insertAction = entityInsertAction<T>(this._entityType);

    //#endregion

    //#region delete actions
    @dispatch()
    private deleteAction = entityDeleteAction<T>(this._entityType);

    //#endregion

    //#endregion

    //#region UI Actions

    //#endregion

    //#region Epic
    public createEpic() {
        return [this.createEpicOfLoad(), this.createEpicOfDML()];
    }

    private createEpicOfLoad(): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.LOAD).pipe(
                filter(action =>
                    action.payload.entityType === this._entityType
                    && action.payload.phaseType === EntityActionPhaseEnum.TRIGGER),
                switchMap(action => this.load(action.payload.pagination, action.payload.queryCondition).pipe(
                    map(data => this.succeededAction(EntityActionTypeEnum.LOAD, data)),
                    catchError(response =>
                        of(this.failedAction(EntityActionTypeEnum.LOAD, response))
                    ),
                    startWith(this.startedAction(EntityActionTypeEnum.LOAD)))
                ));
    }

    private createEpicOfDML(): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.INSERT, EntityActionTypeEnum.INSERT, EntityActionTypeEnum.INSERT).pipe(
                filter(action =>
                    action.payload.entityType === this._entityType
                    && action.payload.phaseType === EntityActionPhaseEnum.TRIGGER),
                switchMap(action => {
                    const id = Object.keys(action.payload.entities[getEntityKey(this._entityType)])[0];
                    const biz = action.payload.entities[getEntityKey(this._entityType)][id];
                    let ret: Observable<IEntities>;
                    switch (action.type) {
                        case EntityActionTypeEnum.INSERT: {
                            ret = this.insert(id);
                            break;
                        }
                        case EntityActionTypeEnum.DELETE: {
                            ret = this.delete(id);
                            break;
                        }
                        case EntityActionTypeEnum.UPDATE: {
                            ret = this.update(id);
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
    //#endregion

    //#region protected methods

    protected loadEntities(pagination: IPagination = { page: this.DEFAULT_PAGE, limit: this.DEFAULT_LIMIT },
        queryCondition: IQueryCondition = {}) {
        this.loadAction(pagination, queryCondition);
    }

    protected insertEntity(entity: T) {
        this.insertAction(entity.id, entity);
    }

    protected updateEntity(entity: T) {
        this.updateAction(entity.id, entity);
    }

    protected deleteEntity(entity: T) {
        this.deleteAction(entity.id, entity);
    }

    //#endregion

    //#region private methods
    private load(pagination: IPagination, queryCondition: IQueryCondition): Observable<IEntities> {
        return this._http.get(`${WEBAPI_HOST}/${this._url}`).pipe(
            map(records => {
                return normalize(records, [this._entitySchema]).entities;
            })
        );
    }

    private insert(id: string): Observable<IEntities> {
        const entities = Immutable(this._store.getState().entities).asMutable({ deep: true });
        const created = denormalize(id, this._entitySchema, entities);

        const formData: FormData = new FormData();

        formData.append(getEntityKey(this._entityType), JSON.stringify(created));

        for (let i = 0; i < this._uploader.queue.length; i++) {
            formData.append(i.toString(), this._uploader.queue[i]._file, this._uploader.queue[i].file.name);
        }
        this._uploader.clearQueue();

        return this._http.post<T>(`${WEBAPI_HOST}/${this._url}`, formData).pipe(
            map(records => {
                return normalize(records, [this._entitySchema]).entities;
            })
        );
    }

    private update(id: string): Observable<IEntities> {
        const entities = Immutable(this._store.getState().entities).asMutable({ deep: true });
        const updated = denormalize(id, this._entitySchema, entities);
        const formData: FormData = new FormData();

        formData.append(getEntityKey(this._entityType), JSON.stringify(updated));
        for (let i = 0; i < this._uploader.queue.length; i++) {
            formData.append(i.toString(), this._uploader.queue[i]._file, this._uploader.queue[i].file.name);
        }
        this._uploader.clearQueue();

        return this._http.put<T>(`${WEBAPI_HOST}/${this._url}`, formData).pipe(
            map(records => {
                return normalize(records, [this._entitySchema]).entities;
            })
        );
    }

    private delete(id: string): Observable<IEntities> {
        return this._http.delete<T>(`${WEBAPI_HOST}/${this._url}/${id}`).pipe(
            map(records => {
                return normalize(records, [this._entitySchema]).entities;
            })
        );
    }
    //#endregion
}
