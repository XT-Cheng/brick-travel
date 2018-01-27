import { EntityAction, EntityActionTypeEnum } from "../entity.action";
import { ITravelAgenda, IDailyTrip, ITravelViewPoint } from "./travelAgenda.model";
import { merge } from 'seamless-immutable';

export function travelAgendaReducer(state: { [id: string]: ITravelAgenda } = {}, action: EntityAction): { [id: string]: ITravelAgenda } {
    switch (action.type) {
        case EntityActionTypeEnum.LOAD: {
            if (action.payload.entities.travelAgendas)
                state = merge(state,action.payload.entities.travelAgendas);
        }
    }

    return state;
}

export function dailyTripReducer(state: { [id: string]: IDailyTrip } = {}, action: EntityAction): { [id: string]: IDailyTrip } {
    switch (action.type) {
        case EntityActionTypeEnum.LOAD: {
            if (action.payload.entities.dailyTrips)
                state = merge(state,action.payload.entities.dailyTrips);
        }
    }

    return state;
}

export function travelViewPointReducer(state: { [id: string]: ITravelViewPoint } = {}, action: EntityAction): { [id: string]: ITravelViewPoint } {
     switch (action.type) {
        case EntityActionTypeEnum.LOAD: {
            if (action.payload.entities.travelViewPoints)
                state = merge(state,action.payload.entities.travelViewPoints);
        }
    }

    return state;
}