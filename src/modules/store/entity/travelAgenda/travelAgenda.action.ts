import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import {
    entityLoadAction,
    entityLoadActionFailed,
    entityLoadActionStarted,
    entityLoadActionSucceeded,
    EntityTypeEnum,
    entityUpdateAction,
} from '../entity.action';
import { IDailyTrip, ITravelAgenda } from './travelAgenda.model';

@Injectable()
export class TravelAgendaActionGenerator {

    //#region load TravelAgenda
    loadTravelAgendaStarted = entityLoadActionStarted(EntityTypeEnum.TRAVELAGENDA);

    @dispatch()
    loadTravelAgendas = entityLoadAction(EntityTypeEnum.TRAVELAGENDA);

    loadTravelAgendaSucceeded = entityLoadActionSucceeded(EntityTypeEnum.TRAVELAGENDA);

    loadTravelAgendaFailed = entityLoadActionFailed(EntityTypeEnum.TRAVELAGENDA)
    //#endregion

    //#region update TravelAgenda
    @dispatch()
    updateTravelAgenda = entityUpdateAction<ITravelAgenda>(EntityTypeEnum.TRAVELAGENDA, 'travelAgendas');
    //#endregion

    //#region update TravelAgenda
    @dispatch()
    updateDailyTrip = entityUpdateAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP, 'dailyTrips');
    //#endregion
}