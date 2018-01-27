import { combineReducers } from 'redux-seamless-immutable';

import { cityReducer } from './city/city.reducer';
import { IEntities } from './entity.model';
import { filterCategoryReducer, filterCriteriaReducer } from './filterCategory/filterCategory.reducer';
import { dailyTripReducer, travelAgendaReducer, travelViewPointReducer } from './travelAgenda/travelAgenda.reducer';
import { viewPointCommentReducer, viewPointReducer } from './viewPoint/viewPoint.reducer';

export const entityReducer =
  combineReducers<IEntities>({
    cities: cityReducer,
    viewPoints: viewPointReducer,
    viewPointComments: viewPointCommentReducer,
    travelViewPoints: travelViewPointReducer,
    dailyTrips: dailyTripReducer,
    travelAgendas: travelAgendaReducer,
    users: (state,action) => state,
    filterCategories: filterCategoryReducer,
    filterCriteries: filterCriteriaReducer
  });

// export function entityReducer(state: IEntities = INIT_ENTITY_STATE, action: EntityAction): IEntities {
//   if (action.payload && action.payload.entities) {
//     switch (action.type) {
//       case EntityActionTypeEnum.LOAD: {
//         let nextState = asMutable(state); 

//         Object.keys(action.payload.entities).forEach(key => {
//           Object.keys(action.payload.entities[key]).forEach(id => {
//             if (!Object.keys(state[key]).find(toFind => id === toFind)){
//               if (isImmutable(nextState[key]))
//                 nextState[key] = asMutable(nextState[key]);
//               nextState[key][id] = action.payload.entities[key][id];
//             }
//           });
//         });

//         return nextState;
//       }
//       case EntityActionTypeEnum.UPDATE: {
//         let nextState = asMutable(state); 

//         Object.keys(action.payload.entities).forEach(key => {
//           Object.keys(action.payload.entities[key]).forEach(id => {
//             if (Object.keys(state[key]).find(toFind => id === toFind)){
//               if (isImmutable(nextState[key]))
//                 nextState[key] = asMutable(nextState[key]);
//               nextState[key][id] = action.payload.entities[key][id];
//             }
//           });
//         });

//         return nextState;
//       }
//       case EntityActionTypeEnum.INSERT: {
//         let nextState = asMutable(state); 

//         Object.keys(action.payload.entities).forEach(key => {
//           Object.keys(action.payload.entities[key]).forEach(id => {
//             if (!Object.keys(state[key]).find(toFind => id === toFind)){
//               if (isImmutable(nextState[key]))
//                 nextState[key] = asMutable(nextState[key]);
//               nextState[key][id] = action.payload.entities[key][id];
//             }
//           });
//         });

//         return nextState;
//       }
//       case EntityActionTypeEnum.DELETE: {
//         let nextState = asMutable(state); 

//         Object.keys(action.payload.entities).forEach(key => {
//           Object.keys(action.payload.entities[key]).forEach(id => {
//             if (Object.keys(state[key]).find(toFind => id === toFind)){
//               if (isImmutable(nextState[key]))
//                 nextState[key] = asMutable(nextState[key]);
//               delete nextState[key][id];
//             }
//           });
//         });

//         return nextState;
//       }
//     }
//   }
  
//   return state;
// };