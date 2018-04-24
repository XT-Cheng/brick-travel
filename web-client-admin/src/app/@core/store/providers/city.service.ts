import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { denormalize } from 'normalizr';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { FILE_UPLOADER } from '../../fileUpload/fileUpload.module';
import { FileUploader } from '../../fileUpload/providers/file-uploader';
import { ICityBiz, translateCityFromBiz } from '../bizModel/city/city.biz.model';
import { ICity } from '../entity/city/city.model';
import { STORE_ENTITIES_KEY } from '../entity/entity.model';
import { city } from '../entity/entity.schema';
import { IAppState, STORE_KEY } from '../store.model';
import { EntityTypeEnum } from '../store.module';
import { EntityService } from './entity.service';

@Injectable()
export class CityService extends EntityService<ICity, ICityBiz> {
    //#region private member

    private citiesSelector$: BehaviorSubject<ICityBiz[]> = new BehaviorSubject([]);

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>) {
        super(_http, _uploader, _store, EntityTypeEnum.CITY, city, `cities`);

        this.getCities(this._store).subscribe((value) => {
            this.citiesSelector$.next(value);
        });
    }
    //#endregion

    //#region public methods
    public get cities$(): Observable<ICityBiz[]> {
        return this.citiesSelector$.asObservable();
    }

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

    //#endregion

    //#region Entities Selector

    private getCities(store: NgRedux<IAppState>): Observable<ICityBiz[]> {
        return store.select<{ [id: string]: ICity }>([STORE_KEY.entities, STORE_ENTITIES_KEY.cities]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [city], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    //#endregion
}
