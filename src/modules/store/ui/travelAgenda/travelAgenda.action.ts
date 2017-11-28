import { FluxStandardAction } from 'flux-standard-action';

import { ITravelAgendaBiz, IDailyTripBiz } from '../../../../bizModel/model/travelAgenda.biz.model';
import { IUIActionMetaInfo, IUIActionPayload } from '../ui.action';

let defaultAgendaActionPayload = {
    selectedTravelAgendaId: '',
    selectedDailyTripId: '',
    error: null,
    updateTravelAgenda: {'': null}
}

export interface IUITravelAgendaActionMetaInfo extends IUIActionMetaInfo {

}

export interface IUITravelAgendaActionPayload extends IUIActionPayload {
    selectedTravelAgendaId: string,
    selectedDailyTripId: string,
    updateTravelAgenda: {[id: string] : ITravelAgendaBiz}
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

export function selectDailyTripAction(dailyTrip: IDailyTripBiz): UITravelAgendaAction {
    return {
        type: UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP,
        meta: { progressing : false },
        payload: Object.assign({},defaultAgendaActionPayload,{
            selectedDailyTripId: dailyTrip?dailyTrip.id:''
        })
    };
}