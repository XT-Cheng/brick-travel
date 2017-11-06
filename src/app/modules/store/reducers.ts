import { combineReducers } from 'redux';
import { cityReducer } from './city/reducers';

// Define the global store shape by combining our application's
// reducers together into a given structure.
export const rootReducer = 
  combineReducers<any>({
    cities: cityReducer
  });
