import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import {
    entityLoadAction,
    entityLoadActionFailed,
    entityLoadActionStarted,
    entityLoadActionSucceeded,
    EntityTypeEnum,
} from '../entity.action';

@Injectable()
export class CityActionGenerator {

    //#region load city
    loadCityStarted = entityLoadActionStarted(EntityTypeEnum.CITY);

    @dispatch()
    loadCities = entityLoadAction(EntityTypeEnum.CITY);

    loadCitySucceeded = entityLoadActionSucceeded(EntityTypeEnum.CITY);

    loadCityFailed = entityLoadActionFailed(EntityTypeEnum.CITY)
    //#endregion
}