import { IUIActionMetaInfo, IUIActionPayload } from "../ui.action";
import { FluxStandardAction } from "flux-standard-action";

export interface IUITravelAgendaActionMetaInfo extends IUIActionMetaInfo {

}

export interface IUITravelAgendaActionPayload extends IUIActionPayload {
    selectedTravelAgendaId: string,
    selectedDailyTripId: string
}

export type UITravelAgendaAction = FluxStandardAction<IUITravelAgendaActionPayload, IUITravelAgendaActionMetaInfo>;

export enum UITravelAgendaActionTypeEnum {
    SELECT_TRAVELADENDA = "UI:TRAVELAGENDA:SELECT_TRAVELADENDA",
    SELECT_DAILYTRIP = "UI:TRAVELAGENDA:SELECT_DAILYTRIP"
}

export function selectTravelAgendaAction(selectedTravelAgendaId: string): UITravelAgendaAction {
    return {
        type: UITravelAgendaActionTypeEnum.SELECT_TRAVELADENDA,
        meta: null,
        payload: {
            selectedTravelAgendaId: selectedTravelAgendaId,
            selectedDailyTripId: null,
            error: null
        }
    };
}

export function selectDailyTripAction(selectedDailyTripId: string): UITravelAgendaAction {
    return {
        type: UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP,
        meta: null,
        payload: {
            selectedTravelAgendaId: null,
            selectedDailyTripId: selectedDailyTripId,
            error: null
        }
    };
}