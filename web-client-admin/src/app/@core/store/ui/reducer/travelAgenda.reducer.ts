import { FluxStandardAction } from 'flux-standard-action';
import * as Immutable from 'seamless-immutable';

import { IActionMetaInfo } from '../../store.action';
import { INIT_UI_TRAVELAGENDA_STATE, ITravelAgendaUI, STORE_UI_TRAVELAGENDA_KEY } from '../model/travelAgenda.model';
import { IUIActionPayload, UIActionTypeEnum } from '../ui.action';
import { STORE_UI_COMMON_KEY } from '../ui.model';

interface IUITravelAgendaActionPayload extends IUIActionPayload {
    selectedDailyTripId: string;
    selectedTravelViewPointId: string;
}

const defaultUIAgendaActionPayload: IUITravelAgendaActionPayload = {
    searchKey: '',
    selectedId: '',
    selectedDailyTripId: '',
    selectedTravelViewPointId: '',
    error: null,
    entityType: null,
    actionId: ''
};

type UITravelAgendaAction = FluxStandardAction<IUITravelAgendaActionPayload, IActionMetaInfo>;

enum UITravelAgendaActionTypeEnum {
    SELECT_DAILYTRIP = 'UI:TRAVELAGENDA:SELECT_DAILYTRIP',
    SELECT_TRAVELVIEWPOINT = 'UI:TRAVELAGENDA:SELECT_TRAVELVIEWPOINT'
}

export function travelAgendaReducer(state = INIT_UI_TRAVELAGENDA_STATE, action: UITravelAgendaAction): ITravelAgendaUI {
    switch (action.type) {
        case UIActionTypeEnum.SEARCH: {
            return <any>Immutable(state).set(STORE_UI_COMMON_KEY.searchKey, action.payload.searchKey);
        }
        case UIActionTypeEnum.SELECT: {
            return <any>Immutable(state).set(STORE_UI_COMMON_KEY.selectedId, action.payload.selectedId);
        }
        case UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP: {
            return <any>Immutable(state).set(STORE_UI_TRAVELAGENDA_KEY.selectedDailyTripId, action.payload.selectedDailyTripId);
        }
        case UITravelAgendaActionTypeEnum.SELECT_TRAVELVIEWPOINT: {
            return <any>Immutable(state).set(STORE_UI_TRAVELAGENDA_KEY.selectedTravelViewPointId, action.payload.selectedTravelViewPointId);
        }
    }
    return <any>state;
}
