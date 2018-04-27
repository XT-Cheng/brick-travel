import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { denormalize } from 'normalizr';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest, map, switchMap } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { ICityBiz } from '../bizModel/model/city.biz.model';
import { EntityTypeEnum, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { city } from '../entity/entity.schema';
import { ICity } from '../entity/model/city.model';
import { IAppState, STORE_KEY } from '../store.model';
import { entitySearchAction, entitySelectAction } from '../ui/ui.action';
import { STORE_UI_COMMON_KEY, STORE_UI_KEY } from '../ui/ui.model';
import { CityService } from './city.service';

@Injectable()
export class CityUIService {
    //#region Private members

    private _selectedCity: ICityBiz;
    private _selectedCitySelector$: BehaviorSubject<ICityBiz> = new BehaviorSubject(null);

    private _searchedCities: ICityBiz[];
    private _searchKey: string;
    private _searchedCitiesSelector$: BehaviorSubject<ICityBiz[]> = new BehaviorSubject(null);
    private _searchKeySelector$: BehaviorSubject<string> = new BehaviorSubject(null);

    private _searchCityAction = entitySearchAction(EntityTypeEnum.CITY);
    private _selectCityAction = entitySelectAction(EntityTypeEnum.CITY);

    //#region Constructor

    constructor(private _store: NgRedux<IAppState>, private _cityService: CityService) {
        this.getSelectedCity(this._store).subscribe((value) => {
            this._selectedCity = value;
            this._selectedCitySelector$.next(value);
        });

        this.getSearchedCities(this._store).subscribe((value) => {
            this._searchedCitiesSelector$.next(value);
        });

        this.getCitySearchKey(this._store).subscribe(value => {
            this._searchKey = value;
            this._searchKeySelector$.next(value);
        });
    }
    //#endregion

    //#region Public property

    public get selectedCity$(): Observable<ICityBiz> {
        return this._selectedCitySelector$.asObservable();
    }

    public get selectedCity(): ICityBiz {
        return this._selectedCity;
    }

    public get searchedCities$(): Observable<ICityBiz[]> {
        return this._searchedCitiesSelector$.asObservable();
    }

    public get searchKey(): string {
        return this._searchKey;
    }

    //#endregion

    //#region Public methods

    public searchCity(searchKey: string) {
        this._store.dispatch(this._searchCityAction(searchKey));
    }

    public selectCity(c: ICityBiz) {
        this._store.dispatch(this._selectCityAction(c.id));
    }

    //#endregion

    //#region Private methods
    private getCitySearchKey(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.city, STORE_UI_COMMON_KEY.searchKey]);
    }

    private getSelectedCityId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.city, STORE_UI_COMMON_KEY.selectedId]);
    }

    private getSelectedCity(store: NgRedux<IAppState>): Observable<ICityBiz> {
        return this.getSelectedCityId(store).pipe(
            switchMap(id => {
                return store.select<ICity>([STORE_KEY.entities, STORE_ENTITIES_KEY.cities, id]);
            }),
            map(ct => {
                return ct ? denormalize(ct.id, city, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
            })
        );
    }

    private getSearchedCities(store: NgRedux<IAppState>): Observable<ICityBiz[]> {
        return this._cityService.cities$.pipe(
            combineLatest(this._searchKeySelector$, (cities, searchKey) => {
                return cities.filter(c => {
                    let matchSearchKey = true;
                    if (searchKey !== '') {
                        matchSearchKey = c.name.indexOf(searchKey) !== -1;
                    }

                    return matchSearchKey;
                });
            })
        );
    }
    //#endregion
}
