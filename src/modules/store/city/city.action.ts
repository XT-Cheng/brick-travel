import { Injectable } from "@angular/core";

import { dispatch } from "@angular-redux/store";
import { entityActionStarted, EntityActionTypeEnum, EntityTypeEnum, entityAction, entityActionSucceeded, entityActionFailed } from "../store.action";

@Injectable()
export class CityAction {

    //#region load city
    loadCityStarted = entityActionStarted(EntityActionTypeEnum.LOAD, EntityTypeEnum.CITY);

    @dispatch()
    loadCities = entityAction(EntityActionTypeEnum.LOAD, EntityTypeEnum.CITY);

    loadCitySucceeded = entityActionSucceeded(EntityActionTypeEnum.LOAD, EntityTypeEnum.CITY);

    loadCityFailed = entityActionFailed(EntityActionTypeEnum.LOAD, EntityTypeEnum.CITY)
    //#endregion

    //#region update city
    updateCityStarted = entityActionStarted(EntityActionTypeEnum.UPDATE, EntityTypeEnum.CITY);

    @dispatch()
    updateCities = entityAction(EntityActionTypeEnum.UPDATE, EntityTypeEnum.CITY);

    updateCitySucceeded = entityActionSucceeded(EntityActionTypeEnum.UPDATE, EntityTypeEnum.CITY);

    updateCityFailed = entityActionFailed(EntityActionTypeEnum.UPDATE, EntityTypeEnum.CITY)
    //#endregion
}