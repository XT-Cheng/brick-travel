import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { FILE_UPLOADER } from '../../fileUpload/fileUpload.module';
import { FileUploader } from '../../fileUpload/providers/file-uploader';
import { ICityBiz } from '../bizModel/city/city.biz.model';
import { ICity } from '../entity/city/city.model';
import { city } from '../entity/entity.schema';
import { IAppState } from '../store.model';
import { EntityTypeEnum } from '../store.module';
import { EntityService } from './entity.service';

@Injectable()
export class CityService extends EntityService<ICity, ICityBiz> {
    //#region Constructor
    constructor(protected _http: HttpClient,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>) {
        super(_http, _uploader, _store, EntityTypeEnum.CITY, city, `cities`);
    }
    //#endregion

    //#region public methods
    public loadCities() {
        this.loadEntities();
    }

    //#endregion
}
