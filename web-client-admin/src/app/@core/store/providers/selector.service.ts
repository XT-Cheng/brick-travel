import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { denormalize } from 'normalizr';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { ICityBiz } from '../bizModel/city/city.biz.model';
import { ICity } from '../entity/city/city.model';
import { STORE_ENTITIES_KEY } from '../entity/entity.model';
import { city } from '../entity/entity.schema';
import { IAppState, STORE_KEY } from '../store.model';

@Injectable()
export class SelectorService {
    private citiesSelector$: BehaviorSubject<ICityBiz[]> = new BehaviorSubject([]);

    public get cities$(): Observable<ICityBiz[]> {
        return this.citiesSelector$.asObservable();
    }

    constructor(private _store: NgRedux<IAppState>) {
        this.getCities(this._store).subscribe((value) => {
            this.citiesSelector$.next(value);
        });
    }

    //#region Entities Selector

    private getCities(store: NgRedux<IAppState>): Observable<ICityBiz[]> {
        return store.select<{ [id: string]: ICity }>([STORE_KEY.entities, STORE_ENTITIES_KEY.cities]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [city], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    //#endregion

    //#region UI Selector

    //#region User Logged In

    //#endregion

    //#region Selected City

    //#endregion

    //#region Selected DailyTrip

    //#endregion

    //#region Selected TravelAgenda

    //#endregion

    //#region Selected TravelViewPoint

    //#endregion

    //#region Selected ViewPoint

    //#endregion

    //#region ViewMode

    //#endregion

    //#region Filtered ViewPoints

    //#endregion

    //#region ViewPoint Search Key

    //#endregion
    //#region City Search Key
    //#endregion
    //#endregion

}
