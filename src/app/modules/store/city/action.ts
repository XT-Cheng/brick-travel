import { Injectable } from "@angular/core";

import { FluxStandardAction } from 'flux-standard-action';

import { ICity } from "./model";
import { dispatch } from "@angular-redux/store";
import { IError, IMetaInfo } from "../model";

// Flux-standard-action gives us stronger typing of our actions.
type Payload = ICity[] | Error;
type MetaData = IMetaInfo;
export type CityActionType = FluxStandardAction<Payload, MetaData>;

@Injectable()
export class CityAction {
    static readonly LOAD_CITIES = 'LOAD_CITIES';
    static readonly LOAD_CITIES_STARTED = 'LOAD_CITIES_STARTED';
    static readonly LOAD_CITIES_SUCCEEDED = 'LOAD_CITIES_SUCCEEDED';
    static readonly LOAD_CITIES_FAILED = 'LOAD_CITIES_FAILED';
    
    loadCityStarted = (): CityActionType => ({
        type: CityAction.LOAD_CITIES_STARTED,
        meta: null,
        payload: null,
    })

    @dispatch()
    loadCities = (page: number = 0,limit: number = 50): CityActionType => ({
        type: CityAction.LOAD_CITIES,
        meta: {pagination: {page: page,limit: limit}},
        payload: null,
    });

    loadCitySucceeded = (payload: Payload): CityActionType => ({
        type: CityAction.LOAD_CITIES_SUCCEEDED,
        meta: null,
        payload,
    })
    
    loadCityFailed = (error: Error): CityActionType => ({
        type: CityAction.LOAD_CITIES_FAILED,
        meta: null,
        payload: error,
        error: true,
    })
}