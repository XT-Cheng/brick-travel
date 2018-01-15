import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import {
    entityLoadAction,
    entityLoadActionFailed,
    entityLoadActionStarted,
    entityLoadActionSucceeded,
    EntityTypeEnum,
    entityUpdateAction,
    entityInsertAction,
    entityDeleteAction,
    entityFlushAction,
    entityFlushActionStarted,
    entityFlushActionSucceeded,
    entityFlushActionFailed,
} from '../entity.action';
import { IDailyTrip, ITravelAgenda, ITravelViewPoint } from './travelAgenda.model';

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

    //#region update DailyTrip
    @dispatch()
    updateDailyTrip = entityUpdateAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP, 'dailyTrips');
    //#endregion

    //#region insert DailyTrip
    @dispatch()
    insertDailyTrip = entityInsertAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP, 'dailyTrips');

    //#endregion

    //#region insert TravelAgenda
    @dispatch()
    insertTravelAgenda = entityInsertAction<ITravelAgenda>(EntityTypeEnum.TRAVELAGENDA, 'travelAgendas');

    //#endregion

    //#region delete DailyTrip

    @dispatch()
    deleteDailyTrip = entityDeleteAction<IDailyTrip>(EntityTypeEnum.DAILYTRIP, 'dailyTrips');

    //#endregion

    //#region insert TravelViewPoint
    @dispatch()
    insertTravelViewPoint = entityInsertAction<ITravelViewPoint>(EntityTypeEnum.TRAVELVIEWPOINT, 'travelViewPoints');
    //#endregion

    //#region delete TravelViewPoint
    @dispatch()
    updateTravelViewPoint = entityUpdateAction<ITravelViewPoint>(EntityTypeEnum.TRAVELVIEWPOINT, 'travelViewPoints');
    //#endregion

    //#region delete TravelViewPoint

    @dispatch()
    deleteTravelViewPoint = entityDeleteAction<ITravelViewPoint>(EntityTypeEnum.TRAVELVIEWPOINT, 'travelViewPoints');

    //#endregion

    //#region flush TravelAgenda
    flushTravelAgendaStarted = entityFlushActionStarted(EntityTypeEnum.TRAVELAGENDA);

    @dispatch()
    flushTravelAgenda = entityFlushAction(EntityTypeEnum.TRAVELAGENDA, 'travelAgendas');
    
    flushTravelAgendaSucceeded = entityFlushActionSucceeded(EntityTypeEnum.TRAVELAGENDA);

    flushTravelAgendaFailed = entityFlushActionFailed(EntityTypeEnum.TRAVELAGENDA)
    //#endregion
}