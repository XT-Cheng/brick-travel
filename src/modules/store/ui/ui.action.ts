import { IActionMetaInfo, IActionPayload } from "../store.action";
import { Injectable } from "@angular/core";
import { dispatch } from "@angular-redux/store";
import { searchViewPointAction, selectCriteriaAction } from "./viewPoint/viewPoint.action";
import { selectTravelAgendaAction } from "./travelAgenda/travelAgenda.action";

export interface IUIActionMetaInfo extends IActionMetaInfo {}

export interface IUIActionPayload extends IActionPayload {}

@Injectable()
export class UIActionGenerator {
    @dispatch()
    searchViewPoint = searchViewPointAction;

    @dispatch()
    selectCriteria = selectCriteriaAction;

    @dispatch()
    selectTravelAgenda = selectTravelAgendaAction;
}