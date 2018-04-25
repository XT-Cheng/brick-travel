import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { normalize } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';

import { FileUploader } from '../../fileUpload/providers/file-uploader';
import { WEBAPI_HOST } from '../../utils/constants';
import { IBiz } from '../bizModel/biz.model';
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

    private updateAction = entityUpdateAction<T>(this._entityType);

    //#endregion

    //#region insert actions

    private insertAction = entityInsertAction<T>(this._entityType);

    //#endregion

    //#region delete actions

    private deleteAction = entityDeleteAction<T>(this._entityType);

    //#endregion

    //#endregion

    //#region UI Actions

    //#endregion

    //#region Epic
    public createEpic(): Epic<EntityAction, IAppState>[] {
        return [...super.createEpic(), this.createEpicOfDML()];
    }

    private createEpicOfDML(): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.INSERT, EntityActionTypeEnum.DELETE, EntityActionTypeEnum.UPDATE).pipe(
                filter(action =>
                    action.payload.entityType === this._entityType
                    && action.payload.phaseType === EntityActionPhaseEnum.TRIGGER),
                switchMap(action => {
                    const ent = <T>Object.values(action.payload.entities[getEntityKey(this._entityType)])[0];
                    let ret: Observable<IEntities>;
                    switch (action.type) {
                        case EntityActionTypeEnum.INSERT: {
                            ret = this.insert(ent);
                            break;
                        }
                        case EntityActionTypeEnum.DELETE: {
                            ret = this.delete(ent);
                            break;
                        }
                        case EntityActionTypeEnum.UPDATE: {
                            ret = this.update(ent);
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

    protected insertEntity(entity: T) {
        this._store.dispatch(this.insertAction(entity.id, entity));
    }

    protected updateEntity(entity: T) {
        this._store.dispatch(this.updateAction(entity.id, entity));
    }

    protected deleteEntity(entity: T) {
        this._store.dispatch(this.deleteAction(entity.id, entity));
    }

    //#endregion

    //#region private methods

    private insert(ent: T): Observable<IEntities> {
        const formData: FormData = new FormData();

        formData.append(getEntityKey(this._entityType), JSON.stringify(ent));

        for (let i = 0; i < this._uploader.queue.length; i++) {
            formData.append(i.toString(), this._uploader.queue[i]._file, this._uploader.queue[i].file.name);
        }
        this._uploader.clearQueue();

        return this._http.post<T>(`${WEBAPI_HOST}/${this._url}`, formData).pipe(
            map(records => {
                return normalize(records, this._entitySchema).entities;
            })
        );
    }

    private update(ent: T): Observable<IEntities> {
        const formData: FormData = new FormData();

        formData.append(getEntityKey(this._entityType), JSON.stringify(ent));
        for (let i = 0; i < this._uploader.queue.length; i++) {
            formData.append(i.toString(), this._uploader.queue[i]._file, this._uploader.queue[i].file.name);
        }
        this._uploader.clearQueue();

        return this._http.put<T>(`${WEBAPI_HOST}/${this._url}`, formData).pipe(
            map(records => {
                return normalize(records, this._entitySchema).entities;
            })
        );
    }

    private delete(ent: T): Observable<IEntities> {
        return this._http.delete<T>(`${WEBAPI_HOST}/${this._url}/${ent.id}`).pipe(
            map(records => {
                return normalize(records, this._entitySchema).entities;
            })
        );
    }
    //#endregion
}
