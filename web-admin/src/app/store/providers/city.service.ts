import { dispatch, NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import * as Immutable from 'seamless-immutable';
import { denormalize, normalize } from 'normalizr';

import { ICityBiz, translateCityFromBiz } from '../bizModel/city.biz.model';
import {
    EntityAction,
    EntityActionPhaseEnum,
    EntityActionTypeEnum,
    entityLoadAction,
    entityLoadActionFailed,
    entityLoadActionStarted,
    entityLoadActionSucceeded,
    EntityTypeEnum,
    IPagination,
    entityInsertAction,
} from '../entity/entity.action';
import { IEntities } from '../entity/entity.model';
import { city } from '../entity/entity.schema';
import { IActionMetaInfo, IActionPayload } from '../store.action';
import { IAppState } from '../store.model';
import { ICityUI, INIT_UI_CITY_STATE, STORE_UI_CITY_KEY } from '../ui/city/city.model';
import { WEBAPI_HOST } from '../utils/constants';
import { ICity } from '../entity/city/city.model';
import { DirtyTypeEnum, dirtyAddAction } from '../dirty/dirty.action';
import { SelectorService } from './selector.service';

type UICityAction = FluxStandardAction<IUICityActionPayload, IUICityActionMetaInfo>;

enum UICityActionTypeEnum {
    SELECT_CITY = "UI:CITY:SELECT_CITY",
}

export function cityReducer(state = INIT_UI_CITY_STATE, action: UICityAction): ICityUI {
    switch (action.type) {
        case UICityActionTypeEnum.SELECT_CITY: {
            return <any>Immutable(state).set(STORE_UI_CITY_KEY.selectedCityId, action.payload.selectedCityId);
        }
    }
    return <any>state;
};

interface IUICityActionMetaInfo extends IActionMetaInfo {
}

interface IUICityActionPayload extends IActionPayload {
    selectedCityId: string
}

const defaultUICityActionPayload = {
    [STORE_UI_CITY_KEY.selectedCityId]: '',
    error: null,
}

@Injectable()
export class CityService {
    //#region Constructor
    constructor(private _http: HttpClient,
        private _selectorService: SelectorService,
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
    //#region insert actions

    @dispatch()
    private insertCityAction = entityInsertAction<ICity>(EntityTypeEnum.CITY);

    //#endregion

    //#region UI Actions
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
    @dispatch()
    private addDirtyAction = dirtyAddAction(EntityTypeEnum.CITY);

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
    public load() {
        this.loadCitiesAction();
    }

    public selectCity(city: ICityBiz) {
        this.selectCityAction(city);
    }

    public addCity(added : ICityBiz): ICityBiz {
        this.insertCityAction(added.id, translateCityFromBiz(added));
        this.addDirtyAction(added.id, DirtyTypeEnum.CREATED);
        return added;
    }
    //#endregion

    //#region CRUD methods
    public insertCity(id: string) {
        let entities = Immutable(this._store.getState().entities).asMutable({ deep: true });
        let created = denormalize(id, city, entities);

        return this._http.post(`${WEBAPI_HOST}/cities/`, created);
    }

    public updateCity(id: string) {
        let entities = Immutable(this._store.getState().entities).asMutable({ deep: true });
        let updated = denormalize(id, city, entities);

        return this._http.put(`${WEBAPI_HOST}/cities`, updated);
    }

    public deleteCity(id: string) {
        return this._http.delete(`${WEBAPI_HOST}/cities/${id}`);
    }
    //#endregion
}