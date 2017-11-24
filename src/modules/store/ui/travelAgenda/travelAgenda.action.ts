import { IUIActionMetaInfo, IUIActionPayload } from "../ui.action";
import { FluxStandardAction } from "flux-standard-action";

export interface IUITravelAgendaActionMetaInfo extends IUIActionMetaInfo {

}

export interface IUITravelAgendaActionPayload extends IUIActionPayload {
    selectedId: string
}

export type UITravelAgendaAction = FluxStandardAction<IUITravelAgendaActionPayload, IUITravelAgendaActionMetaInfo>;

export enum UITravelAgendaActionTypeEnum {
    SELECT_TRAVELADENDA = "UI:TRAVELAGENDA:SELECT_TRAVELADENDA"
}

export function selectTravelAgendaAction(selectedId: string): UITravelAgendaAction {
    return {
        type: UITravelAgendaActionTypeEnum.SELECT_TRAVELADENDA,
        meta: null,
        payload: { selectedId: selectedId, error: null }
    };
}