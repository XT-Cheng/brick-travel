import { Injectable } from "@angular/core";

import { dispatch } from "@angular-redux/store";
import { GeneralAction, IPayload } from "../action";
import { ICity } from "./model";

@Injectable()
export class CityAction {
    static readonly LOAD_CITIES = 'LOAD_CITIES';
    static readonly LOAD_CITIES_STARTED = 'LOAD_CITIES_STARTED';
    static readonly LOAD_CITIES_SUCCEEDED = 'LOAD_CITIES_SUCCEEDED';
    static readonly LOAD_CITIES_FAILED = 'LOAD_CITIES_FAILED';
    
    loadCityStarted = (): GeneralAction => ({
        type: CityAction.LOAD_CITIES_STARTED,
        meta: {progressing: true},
        payload: null,
    })

    @dispatch()
    loadCities = (page: number = 0,limit: number = 50): GeneralAction => ({
        type: CityAction.LOAD_CITIES,
        meta: {pagination: {page: page,limit: limit}},
        payload: null,
    });

    loadCitySucceeded = (cities: ICity[]): GeneralAction => ({
        type: CityAction.LOAD_CITIES_SUCCEEDED,
        meta: {progressing: false},
        payload: {entities: {cities: cities}},
    })
    
    loadCityFailed = (error: Error): GeneralAction => ({
        type: CityAction.LOAD_CITIES_FAILED,
        meta: {progressing: false},
        payload: {error: error}
    })
}