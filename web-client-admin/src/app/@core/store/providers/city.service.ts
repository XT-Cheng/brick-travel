import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { denormalize } from 'normalizr';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest, map, switchMap } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { ICityBiz } from '../bizModel/model/city.biz.model';
import { EntityTypeEnum, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { citySchema } from '../entity/entity.schema';
import { ICity } from '../entity/model/city.model';
import { IAppState, STORE_KEY } from '../store.model';
import { STORE_UI_COMMON_KEY, STORE_UI_KEY } from '../ui/ui.model';
import { CityUIService } from './city.ui.service';
import { EntityService } from './entity.service';

@Injectable()
export class CityService extends EntityService<ICity, ICityBiz> {
    //#region private member

    private _all$: BehaviorSubject<ICityBiz[]> = new BehaviorSubject([]);

    private _selected: ICityBiz;
    private _selected$: BehaviorSubject<ICityBiz> = new BehaviorSubject(null);

    private _searched: ICityBiz[];
    private _searched$: BehaviorSubject<ICityBiz[]> = new BehaviorSubject(null);

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        protected _store: NgRedux<IAppState>, private _uiService: CityUIService) {
        super(_http, _store, EntityTypeEnum.CITY, citySchema, `cities`);

        this.getAll(this._store).subscribe((value) => {
            this._all$.next(value);
        });

        this.getSelected(this._store).subscribe((value) => {
            this._selected = value;
            this._selected$.next(value);
        });

        this.getSearched(this._store).subscribe((value) => {
            this._searched$.next(value);
        });
    }
    //#endregion

    //#region implemented methods

    //#endregion

    //#region public methods
    public get all$(): Observable<ICityBiz[]> {
        return this._all$.asObservable();
    }

    public get selected$(): Observable<ICityBiz> {
        return this._selected$.asObservable();
    }

    public get selected(): ICityBiz {
        return this._selected;
    }

    public get searched$(): Observable<ICityBiz[]> {
        return this._searched$.asObservable();
    }

    //#region CRUD methods

    //#endregion

    //#endregion

    //#region Entities Selector

    private getAll(store: NgRedux<IAppState>): Observable<ICityBiz[]> {
        return store.select<{ [id: string]: ICity }>([STORE_KEY.entities, STORE_ENTITIES_KEY.cities]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [citySchema], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    private getSelectedId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.city, STORE_UI_COMMON_KEY.selectedId]);
    }

    private getSelected(store: NgRedux<IAppState>): Observable<ICityBiz> {
        return this.getSelectedId(store).pipe(
            switchMap(id => {
                return store.select<ICity>([STORE_KEY.entities, STORE_ENTITIES_KEY.cities, id]);
            }),
            map(ct => {
                return ct ? denormalize(ct.id, citySchema, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
            })
        );
    }

    private getSearched(store: NgRedux<IAppState>): Observable<ICityBiz[]> {
        return this.all$.pipe(
            combineLatest(this._uiService.searchKey$, (cities, searchKey) => {
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
