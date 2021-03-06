import { dispatch, NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';
import { denormalize, normalize } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { FILE_UPLOADER } from '../../fileUpload/fileUpload.module';
import { FileUploader } from '../../fileUpload/providers/file-uploader';
import { WEBAPI_HOST } from '../../utils/constants';
import { ICityBiz, translateCityFromBiz } from '../bizModel/city.biz.model';
import { ICity } from '../entity/city/city.model';
import {
    EntityAction,
    EntityActionPhaseEnum,
    EntityActionTypeEnum,
    entityDeleteAction,
    entityInsertAction,
    entityLoadAction,
    entityLoadActionFailed,
    entityLoadActionStarted,
    entityLoadActionSucceeded,
    EntityTypeEnum,
    entityUpdateAction,
    IPagination,
} from '../entity/entity.action';
import { IEntities } from '../entity/entity.model';
import { city } from '../entity/entity.schema';
import { IActionMetaInfo, IActionPayload } from '../store.action';
import { IAppState } from '../store.model';
import { ICityUI, INIT_UI_CITY_STATE, STORE_UI_CITY_KEY } from '../ui/city/city.model';

type UICityAction = FluxStandardAction<IUICityActionPayload, IUICityActionMetaInfo>;

enum UICityActionTypeEnum {
    SELECT_CITY = "UI:CITY:SELECT_CITY",
    SEARCH_CITY = "UI:CITY:SEARCH_CITY",
}

export function cityReducer(state = INIT_UI_CITY_STATE, action: UICityAction): ICityUI {
    switch (action.type) {
        case UICityActionTypeEnum.SELECT_CITY: {
            return <any>Immutable(state).set(STORE_UI_CITY_KEY.selectedCityId, action.payload.selectedCityId);
        }
        case UICityActionTypeEnum.SEARCH_CITY: {
            return <any>Immutable(state).set(STORE_UI_CITY_KEY.searchKey, action.payload.searchKey);
        }
    }
    return <any>state;
};

interface IUICityActionMetaInfo extends IActionMetaInfo {
}

interface IUICityActionPayload extends IActionPayload {
    searchKey?: string,
    selectedCityId?: string
}

const defaultUICityActionPayload = {
    [STORE_UI_CITY_KEY.selectedCityId]: '',
    [STORE_UI_CITY_KEY.searchKey]: '',
    error: null,
}

@Injectable()
export class CityService {
    //#region Constructor
    constructor(private _http: HttpClient,
        @Inject(FILE_UPLOADER) private _uploader: FileUploader,
        private _store: NgRedux<IAppState>) {
    }
    //#endregion

    //#region Actions

    //#region Entity Actions
    //#region load actions
    private loadCityStartedAction = entityLoadActionStarted(EntityTypeEnum.CITY);

    @dispatch()
    private loadCitiesAction = entityLoadAction(EntityTypeEnum.CITY);

    private loadCitySucceededAction = entityLoadActionSucceeded(EntityTypeEnum.CITY);

    private loadCityFailedAction = entityLoadActionFailed(EntityTypeEnum.CITY)
    //#endregion

    //#region update actions

    @dispatch()
    private updateCityAction = entityUpdateAction<ICity>(EntityTypeEnum.CITY);

    //#endregion

    //#region insert actions

    @dispatch()
    private insertCityAction = entityInsertAction<ICity>(EntityTypeEnum.CITY);

    //#endregion

    //#region delete actions
    @dispatch()
    private deleteCityAction = entityDeleteAction<ICity>(EntityTypeEnum.CITY);

    //#endregion

    //#endregion
    //#region UI Actions
    @dispatch()
    private searchCityAction(searchKey: string): UICityAction {
        return {
            type: UICityActionTypeEnum.SEARCH_CITY,
            meta: { progressing: false },
            payload: Object.assign({}, defaultUICityActionPayload, {
                searchKey: searchKey
            })
        };
    }
    @dispatch()
    private selectCityAction(city: ICityBiz): UICityAction {
        return {
            type: UICityActionTypeEnum.SELECT_CITY,
            meta: { progressing: false },
            payload: <any>Object.assign({}, defaultUICityActionPayload, {
                [STORE_UI_CITY_KEY.selectedCityId]: city ? city.id : ''
            })
        };
    }
    //#region Dirty Actions

    //#endregion

    //#endregion

    //#endregion

    //#region Epic
    public createEpic() {
        return [this.createEpicInternal(EntityTypeEnum.CITY)];
    }

    private createEpicInternal(entityType: EntityTypeEnum): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.LOAD)
            .filter(action => action.meta.entityType == entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
            .switchMap(action => this.getCities(action.meta.pagination)
                .map(data => this.loadCitySucceededAction(data))
                .catch(response =>
                    of(this.loadCityFailedAction(response))
                )
                .startWith(this.loadCityStartedAction()));
    }
    //#endregion

    //#region Private methods
    private getCities(pagination: IPagination): Observable<IEntities> {
        return this._http.get(`${WEBAPI_HOST}/cities`)
            .map(records => {
                return normalize(records, [city]).entities;
            })
    }
    //#endregion

    //#region Public methods
    public search(searchKey: string) {
        this.searchCityAction(searchKey);
    }

    public load() {
        this.loadCitiesAction();
    }

    public selectCity(city: ICityBiz) {
        this.selectCityAction(city);
    }

    public insertCity(added: ICityBiz): Observable<Error | ICity> {
        return this.insert(added).pipe(tap((city) => {
            this.insertCityAction(added.id, translateCityFromBiz(city));
        }),
            catchError((err: Error) => {
                return of(err);
            }));
    }

    public updateCity(update: ICityBiz): Observable<Error | ICity> {
        return this.update(update).pipe(tap((city) => {
            this.updateCityAction(update.id, translateCityFromBiz(city));
        }),
            catchError((err) => {
                return of(err);
            }));
    }

    public deleteCity(del: ICityBiz) {
        return this.delete(del.id).pipe(tap(() => {
            this.deleteCityAction(del.id, translateCityFromBiz(del));
        }),
            catchError((err) => {
                return of(err);
            }));
    }
    //#endregion

    //#region CRUD methods
    public insert(id: string | ICityBiz): Observable<ICity> {
        let created = id;
        if (typeof id == 'string') {
            let entities = Immutable(this._store.getState().entities).asMutable({ deep: true });
            created = denormalize(id, city, entities);
        }

        const formData: FormData = new FormData();

        formData.append("city", JSON.stringify(created));

        for (let i = 0; i < this._uploader.queue.length; i++) {
            formData.append(i.toString(), this._uploader.queue[i]._file, this._uploader.queue[i].file.name);
        }
        this._uploader.clearQueue();

        return this._http.post<ICity>(`${WEBAPI_HOST}/cities/`, formData);
    }

    public update(id: string | ICityBiz) {
        let updated: any = id;
        if (typeof id == 'string') {
            let entities = Immutable(this._store.getState().entities).asMutable({ deep: true });
            updated = denormalize(id, city, entities);
        }

        const formData: FormData = new FormData();

        formData.append("city", JSON.stringify(updated));
        for (let i = 0; i < this._uploader.queue.length; i++) {
            formData.append(i.toString(), this._uploader.queue[i]._file, this._uploader.queue[i].file.name);
        }
        this._uploader.clearQueue();

        return this._http.put<ICity>(`${WEBAPI_HOST}/cities`, formData);
    }

    public delete(id: string) {
        return this._http.delete(`${WEBAPI_HOST}/cities/${id}`);
    }
    //#endregion
}