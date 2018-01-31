import { dispatch } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';
import { normalize } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';

import { ICityBiz } from '../bizModel/model/city.biz.model';
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
} from '../modules/store/entity/entity.action';
import { IEntities } from '../modules/store/entity/entity.model';
import { city } from '../modules/store/entity/entity.schema';
import { IActionMetaInfo, IActionPayload } from '../modules/store/store.action';
import { IAppState } from '../modules/store/store.model';
import { INIT_UI_CITY_STATE, ICityUI } from '../modules/store/ui/city/city.model';
import * as Immutable from 'seamless-immutable'

type UICityAction = FluxStandardAction<IUICityActionPayload, IUICityActionMetaInfo>;

enum UICityActionTypeEnum {
    SELECT_CITY = "UI:CITY:SELECT_CITY",
}

export function cityReducer(state = INIT_UI_CITY_STATE, action: UICityAction): ICityUI {
    switch (action.type) {
        case UICityActionTypeEnum.SELECT_CITY: {
            return Immutable(state).set('selectedCityId', action.payload.selectedCityId);
        }
    }
    return state;
};

interface IUICityActionMetaInfo extends IActionMetaInfo {
}

interface IUICityActionPayload extends IActionPayload {
    selectedCityId: string
}

const defaultCityActionPayload = {
    selectedCityId: '',
    error: null,
}

@Injectable()
export class CityService {
    //#region Constructor
    constructor(private _http: HttpClient) {
    }
    //#endregion

    //#region Actions

    //#region Entity Actions
    private loadCityStarted = entityLoadActionStarted(EntityTypeEnum.CITY);

    @dispatch()
    private loadCities = entityLoadAction(EntityTypeEnum.CITY);

    private loadCitySucceeded = entityLoadActionSucceeded(EntityTypeEnum.CITY);

    private loadCityFailed = entityLoadActionFailed(EntityTypeEnum.CITY)
    //#endregion

    //#region UI Actions
    @dispatch()
    private selectCityAction(city: ICityBiz): UICityAction {
        return {
            type: UICityActionTypeEnum.SELECT_CITY,
            meta: { progressing: false },
            payload: Object.assign({}, defaultCityActionPayload, {
                selectedCityId: city ? city.id : ''
            })
        };
    }
    //#endregion

    //#endregion

    //#region Epic
    public createEpic() {
        return this.createEpicInternal(EntityTypeEnum.CITY);
    }

    private createEpicInternal(entityType: EntityTypeEnum): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.LOAD)
            .filter(action => action.meta.entityType == entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
            .switchMap(action => this.getCities(action.meta.pagination)
                .map(data => this.loadCitySucceeded(data))
                .catch(response =>
                    of(this.loadCityFailed(response))
                )
                .startWith(this.loadCityStarted()));
    }
    //#endregion

    //#region Public methods
    public getCities(pagination: IPagination): Observable<IEntities> {
        return this._http.get('http://localhost:3000/cities')
            .map(records => {
                return normalize(records, [city]).entities;
            })
    }

    public load() {
        this.loadCities();
    }

    public selectCity(city: ICityBiz) {
        this.selectCityAction(city);
    }
}