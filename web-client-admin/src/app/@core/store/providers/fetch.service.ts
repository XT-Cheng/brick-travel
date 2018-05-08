import { NgRedux } from '@angular-redux/store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { normalize, schema } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, filter, map, mergeMap, startWith } from 'rxjs/operators';

import { WEBAPI_HOST } from '../../utils/constants';
import {
    EntityAction,
    entityActionFailed,
    EntityActionPhaseEnum,
    entityActionStarted,
    entityActionSucceeded,
    EntityActionTypeEnum,
    entityLoadAction,
    IPagination,
    IQueryCondition,
} from '../entity/entity.action';
import { EntityTypeEnum, IEntities } from '../entity/entity.model';
import { IAppState } from '../store.model';

export abstract class FetchService {
    private DEFAULT_PAGE = 0;
    private DEFAULT_LIMIT = 50;

    //#region Constructor
    constructor(protected _http: HttpClient,
        protected _store: NgRedux<IAppState>,
        protected _entityType: EntityTypeEnum,
        protected _entitySchema: any,
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

    protected loadAction = entityLoadAction(this._entityType);

    //#endregion

    //#endregion

    //#region UI Actions

    //#endregion

    //#region Epic
    public createEpic(): Epic<EntityAction, IAppState>[] {
        return [this.createEpicOfLoad()];
    }

    private createEpicOfLoad(): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.LOAD).pipe(
                filter(action =>
                    action.payload.entityType === this._entityType
                    && action.payload.phaseType === EntityActionPhaseEnum.TRIGGER),
                mergeMap(action => this.load(action.payload.pagination, action.payload.queryCondition).pipe(
                    map(data => this.succeededAction(EntityActionTypeEnum.LOAD, data)),
                    catchError((errResponse: HttpErrorResponse) => {
                        return of(this.failedAction(EntityActionTypeEnum.LOAD, errResponse.error));
                    }),
                    startWith(this.startedAction(EntityActionTypeEnum.LOAD)))
                ));
    }

    //#endregion

    //#region protected methods

    protected loadEntities(pagination: IPagination = { page: this.DEFAULT_PAGE, limit: this.DEFAULT_LIMIT },
        queryCondition: IQueryCondition = {}) {
        this._store.dispatch(this.loadAction(pagination, queryCondition));
    }

    protected get schema(): any {
        return [this._entitySchema];
    }

    //#endregion

    //#region private methods
    private load(pagination: IPagination, queryCondition: IQueryCondition): Observable<IEntities> {
        return this._http.get(`${WEBAPI_HOST}/${this._url}`).pipe(
            map(records => {
                return normalize(records, this.schema).entities;
            })
        );
    }

    //#endregion
}
