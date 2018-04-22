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
        return [this.createEpicOfLoad(), this.createEpicOfInsert()];
    }

    private createEpicOfLoad(): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.LOAD).pipe(
                filter(action =>
                    action.payload.entityType === this._entityType
                    && action.payload.phaseType === EntityActionPhaseEnum.TRIGGER),
                switchMap(action => this.load(action.payload.pagination, action.payload.queryCondition).pipe(
                    map(data => this.loadSucceededAction(data)),
                    catchError(response =>
                        of(this.loadFailedAction(response))
                    ),
                    startWith(this.startedAction()))
                ));
    }

    private createEpicOfInsert(): Epic<EntityAction, IAppState> {
        return null;
    }
    //#endregion

    //#region public methods

    public loadEntities(pagination: IPagination = { page: this.DEFAULT_PAGE, limit: this.DEFAULT_LIMIT },
        queryCondition: IQueryCondition = {}) {
        this.loadAction(pagination, queryCondition);
    }

    //#endregion

    //#region private methods
    private load(pagination: IPagination, queryCondition: IQueryCondition): Observable<IEntities> {
        return this._http.get(`${WEBAPI_HOST}${this._url}`).pipe(
            map(records => {
                return normalize(records, [this._entitySchema]).entities;
            })
        );
    }

    private insert(idOrBiz: string | U): Observable<T> {
        let created = idOrBiz;
        if (typeof idOrBiz === 'string') {
            const entities = Immutable(this._store.getState().entities).asMutable({ deep: true });
            created = denormalize(idOrBiz, this._entitySchema, entities);
        }

        const formData: FormData = new FormData();

        formData.append(getEntityKey(this._entityType), JSON.stringify(created));

        for (let i = 0; i < this._uploader.queue.length; i++) {
            formData.append(i.toString(), this._uploader.queue[i]._file, this._uploader.queue[i].file.name);
        }
        this._uploader.clearQueue();

        return this._http.post<T>(`${WEBAPI_HOST}/${this._url}`, formData);
    }

    private update(idOrBiz: string | U): Observable<T> {
        let updated: any = idOrBiz;
        if (typeof idOrBiz === 'string') {
            const entities = Immutable(this._store.getState().entities).asMutable({ deep: true });
            updated = denormalize(idOrBiz, this._entitySchema, entities);
        }

        const formData: FormData = new FormData();

        formData.append(getEntityKey(this._entityType), JSON.stringify(updated));
        for (let i = 0; i < this._uploader.queue.length; i++) {
            formData.append(i.toString(), this._uploader.queue[i]._file, this._uploader.queue[i].file.name);
        }
        this._uploader.clearQueue();

        return this._http.put<T>(`${WEBAPI_HOST}/${this._url}`, formData);
    }

    private delete(id: string): Observable<T> {
        return this._http.delete<T>(`${WEBAPI_HOST}/${this._url}/${id}`);
    }
    //#endregion
}
