import { combineReducers } from 'redux-seamless-immutable';

import * as Immutable from 'seamless-immutable';

import { cityReducer } from './city/city.reducer';
import { IEntities, INIT_ENTITY_STATE } from './entity.model';
import { filterCategoryReducer, filterCriteriaReducer } from './filterCategory/filterCategory.reducer';
import { dailyTripReducer, travelAgendaReducer, travelViewPointReducer } from './travelAgenda/travelAgenda.reducer';
import { viewPointCommentReducer, viewPointReducer } from './viewPoint/viewPoint.reducer';
import { EntityAction, EntityActionTypeEnum } from './entity.action';

// export const entityReducer =
//   combineReducers<IEntities>({
//     cities: cityReducer,
//     viewPoints: viewPointReducer,
//     viewPointComments: viewPointCommentReducer,
//     travelViewPoints: travelViewPointReducer,
//     dailyTrips: dailyTripReducer,
//     travelAgendas: travelAgendaReducer,
//     users: (state,action) => state,
//     filterCategories: filterCategoryReducer,
//     filterCriteries: filterCriteriaReducer
//   });

export function entityReducer(state: IEntities = INIT_ENTITY_STATE, action: EntityAction): IEntities {
  if (action.payload && action.payload.entities) {
    switch (action.type) {
      case EntityActionTypeEnum.LOAD:
      case EntityActionTypeEnum.INSERT:
      case EntityActionTypeEnum.UPDATE: {
        state = Immutable(state).merge(action.payload.entities,{deep: true});

        return state;
      }
      // case EntityActionTypeEnum.UPDATE: {
      //   let oldstate = state;
      //   Object.keys(action.payload.entities).forEach(key => {
      //     let result = Immutable(state[key]).merge(action.payload.entities[key]);
      //     state = Immutable(state).set(key, result);
      //   });
      //   // Object.keys(action.payload.entities).forEach(key => {
      //   //   Object.keys(action.payload.entities[key]).forEach(id => {
      //   //     let result = Immutable(state[key][id]).merge(action.payload.entities[key][id]);
      //   //     state = Immutable(state).setIn([key, id], result);
      //   //   });
      //   // })
      //   console.log(oldstate.cities == state.cities);
      //   console.log(oldstate.viewPoints == state.viewPoints);
      //   console.log(oldstate.travelAgendas == state.travelAgendas);

      //   return state;
      // }
      // case EntityActionTypeEnum.INSERT: {
      //   return state;
      // let nextState = asMutable(state);

      // Object.keys(action.payload.entities).forEach(key => {
      //   Object.keys(action.payload.entities[key]).forEach(id => {
      //     if (!Object.keys(state[key]).find(toFind => id === toFind)) {
      //       if (isImmutable(nextState[key]))
      //         nextState[key] = asMutable(nextState[key]);
      //       nextState[key][id] = action.payload.entities[key][id];
      //     }
      //   });
      // });

      // return nextState;
      // }
      case EntityActionTypeEnum.DELETE: {
        Object.keys(action.payload.entities).forEach(key => {
          Object.keys(action.payload.entities[key]).forEach(id => {
          let x = Immutable(state[key]).without(id);
          state = Immutable(state).set(key,x);
        })
      });
       // let withoutOutput = Immutable.without(iObj.entities.cities,'1');
        return state;
        // let nextState = asMutable(state);

        // Object.keys(action.payload.entities).forEach(key => {
        //   Object.keys(action.payload.entities[key]).forEach(id => {
        //     if (Object.keys(state[key]).find(toFind => id === toFind)) {
        //       if (isImmutable(nextState[key]))
        //         nextState[key] = asMutable(nextState[key]);
        //       delete nextState[key][id];
        //     }
        //   });
        // });

        // return nextState;
      }
    }
  }

  return state;
};