import { FluxStandardAction } from 'flux-standard-action';

import { ITravelAgendaBiz } from '../../../../bizModel/model/travelAgenda.biz.model';
import { IActionMetaInfo, IActionPayload } from '../../store.action';

export interface IUITravelAgendaActionMetaInfo extends IActionMetaInfo {

}

export interface IUITravelAgendaActionPayload extends IActionPayload {
    selectedTravelAgendaId: string,
    selectedDailyTripId: string,
    updateTravelAgenda: {[id: string] : ITravelAgendaBiz}
}

let defaultAgendaActionPayload = {
    selectedTravelAgendaId: '',
    selectedDailyTripId: '',
    error: null,
    updateTravelAgenda: {'': null}
}

export type UITravelAgendaAction = FluxStandardAction<IUITravelAgendaActionPayload, IUITravelAgendaActionMetaInfo>;

export enum UITravelAgendaActionTypeEnum {
    SELECT_TRAVELADENDA = "UI:TRAVELAGENDA:SELECT_TRAVELADENDA",
    SELECT_DAILYTRIP = "UI:TRAVELAGENDA:SELECT_DAILYTRIP"
}

export function selectTravelAgendaAction(selectedTravelAgendaId: string): UITravelAgendaAction {
    return {
        type: UITravelAgendaActionTypeEnum.SELECT_TRAVELADENDA,
        meta: { progressing : false },
        payload: Object.assign({},defaultAgendaActionPayload,{
            selectedTravelAgendaId: selectedTravelAgendaId
        })
    };
}

export function selectDailyTripAction(selectedDailyTripId: string): UITravelAgendaAction {
    return {
        type: UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP,
        meta: { progressing : false },
        payload: Object.assign({},defaultAgendaActionPayload,{
            selectedDailyTripId: selectedDailyTripId
        })
    };
}