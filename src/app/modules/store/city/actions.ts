import { Injectable } from "@angular/core";

import { FluxStandardAction } from 'flux-standard-action';

import { ICity } from "./models";

// Flux-standard-action gives us stronger typing of our actions.
type Payload = ICity[];// | Error;
type MetaData = any;
export type CityAction = FluxStandardAction<Payload, MetaData>;

@Injectable()
export class CityActions {
    static readonly LOAD_CITIES = 'LOAD_CITIES';
    static readonly LOAD_CITIES_STARTED = 'LOAD_CITIES_STARTED';
    static readonly LOAD_CITIES_SUCCEEDED = 'LOAD_CITIES_SUCCEEDED';
    static readonly LOAD_CITIES_FAILED = 'LOAD_CITIES_FAILED';
    
    loadCityStarted = (): CityAction => ({
        type: CityActions.LOAD_CITIES_STARTED,
        meta: null,
        payload: null,
    })

    loadCities = (): CityAction => ({
        type: CityActions.LOAD_CITIES,
        meta: null,
        payload: null,
    });

    loadCitySucceeded = (payload: Payload): CityAction => ({
        type: CityActions.LOAD_CITIES_SUCCEEDED,
        meta: null,
        payload,
    })
    
    loadCityFailed = (): CityAction => ({
        type: CityActions.LOAD_CITIES_FAILED,
        meta: null,
        payload: null,
        error: true,
    })
}