import { IActionMetaInfo, IActionPayload } from "../store.action";
import { Injectable } from "@angular/core";
import { dispatch } from "@angular-redux/store";
import { searchViewPointAction, selectCriteriaAction, selectViewPointAction } from "./viewPoint/viewPoint.action";
import { selectTravelAgendaAction, selectDailyTripAction } from "./travelAgenda/travelAgenda.action";

export interface IUIActionMetaInfo extends IActionMetaInfo {}

export interface IUIActionPayload extends IActionPayload {}

@Injectable()
export class UIActionGenerator {
    @dispatch()
    searchViewPoint = searchViewPointAction;

    @dispatch()
    selectViewPoint = selectViewPointAction;

    @dispatch()
    selectCriteria = selectCriteriaAction;

    @dispatch()
    selectTravelAgenda = selectTravelAgendaAction;

    @dispatch()
    selectDailyTrip = selectDailyTripAction;
}