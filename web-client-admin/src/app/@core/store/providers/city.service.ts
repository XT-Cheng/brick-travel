import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { denormalize } from 'normalizr';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest, map, switchMap } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { FILE_UPLOADER } from '../../fileUpload/fileUpload.module';
import { FileUploader } from '../../fileUpload/providers/file-uploader';
import { ICityBiz, translateCityFromBiz } from '../bizModel/model/city.biz.model';
import { EntityTypeEnum, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { city } from '../entity/entity.schema';
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
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>, private _uiService: CityUIService) {
        super(_http, _uploader, _store, EntityTypeEnum.CITY, [city], `cities`);

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

    public byId(id: string): ICityBiz {
        return denormalize(id, city, Immutable(this._store.getState().entities).asMutable({ deep: true }));
    }

    //#region CRUD methods

    public fetch() {
        this.loadEntities();
    }

    public add(c: ICityBiz) {
        this.insertEntity(translateCityFromBiz(c));
    }

    public change(c: ICityBiz) {
        this.updateEntity(translateCityFromBiz(c));
    }

    public remove(c: ICityBiz) {
        this.deleteEntity(translateCityFromBiz(c));
    }

    public addById(id: string) {
        const toAdd = this.byId(id);
        if (!toAdd) { throw new Error(`City Id ${id} not exist!`); }

        this.add(toAdd);
    }

    public changeById(id: string) {
        const toChange = this.byId(id);
        if (!toChange) { throw new Error(`City Id ${id} not exist!`); }

        this.change(toChange);
    }

    public removeById(id: string) {
        const toRemove = this.byId(id);
        if (!toRemove) { throw new Error(`City Id ${id} not exist!`); }

        this.remove(toRemove);
    }

    //#endregion

    //#endregion

    //#region Entities Selector

    private getAll(store: NgRedux<IAppState>): Observable<ICityBiz[]> {
        return store.select<{ [id: string]: ICity }>([STORE_KEY.entities, STORE_ENTITIES_KEY.cities]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [city], Immutable(store.getState().entities).asMutable({ deep: true }));
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
                return ct ? denormalize(ct.id, city, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
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
