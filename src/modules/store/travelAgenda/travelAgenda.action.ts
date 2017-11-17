import { Injectable } from "@angular/core";

import { dispatch } from "@angular-redux/store";
import { entityActionStarted, EntityActionTypeEnum, EntityTypeEnum, entityAction, entityActionSucceeded, entityActionFailed } from "../store.action";

@Injectable()
export class TravelAgendaAction {

    //#region load TravelAgenda
    loadTravelAgendaStarted = entityActionStarted(EntityActionTypeEnum.LOAD, EntityTypeEnum.TRAVELAGENDA);

    @dispatch()
    loadTravelAgendas = entityAction(EntityActionTypeEnum.LOAD, EntityTypeEnum.TRAVELAGENDA);

    loadTravelAgendaSucceeded = entityActionSucceeded(EntityActionTypeEnum.LOAD, EntityTypeEnum.TRAVELAGENDA);

    loadTravelAgendaFailed = entityActionFailed(EntityActionTypeEnum.LOAD, EntityTypeEnum.TRAVELAGENDA)
    //#endregion

    //#region update TravelAgenda
    updateTravelAgendaStarted = entityActionStarted(EntityActionTypeEnum.UPDATE, EntityTypeEnum.TRAVELAGENDA);

    @dispatch()
    updateTravelAgendas = entityAction(EntityActionTypeEnum.UPDATE, EntityTypeEnum.TRAVELAGENDA);

    updateTravelAgendaSucceeded = entityActionSucceeded(EntityActionTypeEnum.UPDATE, EntityTypeEnum.TRAVELAGENDA);

    updateTravelAgendaFailed = entityActionFailed(EntityActionTypeEnum.UPDATE, EntityTypeEnum.TRAVELAGENDA)
    //#endregion
}