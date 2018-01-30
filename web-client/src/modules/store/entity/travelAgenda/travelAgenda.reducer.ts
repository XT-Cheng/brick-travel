import { EntityAction, EntityActionTypeEnum, EntityTypeEnum } from "../entity.action";
import { ITravelAgenda, IDailyTrip, ITravelViewPoint } from "./travelAgenda.model";

export function travelAgendaReducer(state: { [id: string]: ITravelAgenda } = {}, action: EntityAction): { [id: string]: ITravelAgenda } {
    // if (action.payload && action.payload.entities && action.payload.entities.travelAgendas &&
    //     Object.keys(action.payload.entities.travelAgendas).length > 0) {
    //     switch (action.type) {
    //         case EntityActionTypeEnum.LOAD:
    //         case EntityActionTypeEnum.INSERT: {
    //             state = merge(state, action.payload.entities.travelAgendas);
    //             break;
    //         }
    //         case EntityActionTypeEnum.UPDATE: {
    //             state = replace(state, action.payload.entities.travelAgendas);
    //             break;
    //         }
    //     }
    // }

    return state;
}

export function dailyTripReducer(state: { [id: string]: IDailyTrip } = {}, action: EntityAction): { [id: string]: IDailyTrip } {
    // if (action.payload && action.payload.entities && action.payload.entities.dailyTrips &&
    //     Object.keys(action.payload.entities.dailyTrips).length > 0) {
    //     switch (action.type) {
    //         case EntityActionTypeEnum.LOAD:
    //         case EntityActionTypeEnum.INSERT: {
    //             state = merge(state, action.payload.entities.dailyTrips);
    //             break;
    //         }
    //         case EntityActionTypeEnum.UPDATE: {
    //             state = replace(state, action.payload.entities.dailyTrips);
    //             break;
    //         }
    //     }
    // }

    return state;
}

export function travelViewPointReducer(state: { [id: string]: ITravelViewPoint } = {}, action: EntityAction): { [id: string]: ITravelViewPoint } {
    // if (action.payload && action.payload.entities && action.payload.entities.travelViewPoints &&
    //     Object.keys(action.payload.entities.travelViewPoints).length > 0) {
    //     switch (action.type) {
    //         case EntityActionTypeEnum.LOAD:
    //         case EntityActionTypeEnum.INSERT: {
    //             if (action.payload.entities.travelViewPoints)
    //                 state = merge(state, action.payload.entities.travelViewPoints);
    //             break;
    //         }
    //         case EntityActionTypeEnum.DELETE: {
    //             if (action.payload.entities.travelViewPoints)
    //                 state = without(state, action.payload.entities.travelViewPoints);
    //             break;
    //         }
    //     }
    // }
    return state;
}