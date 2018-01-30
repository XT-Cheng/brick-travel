import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { normalize } from 'normalizr';
import { Observable } from 'rxjs/Observable';
import * as Immutable from 'seamless-immutable';

import { IAppState } from '../../store.model';
import { IPagination } from '../entity.action';
import { IEntities } from '../entity.model';
import { travelAgenda } from '../entity.schema';
import { TransportationCategory } from './travelAgenda.model';

interface ITravelAgendaPersistent {
  id: string,
  name: string,
  user: string,
  cover: string,
  dailyTrips: IDailyTripPersistent[]
};

interface IDailyTripPersistent {
  id: string,
  travelViewPoints: ITravelViewPointPersistent[]
}

interface ITravelViewPointPersistent {
  id: string,
  viewPoint: string,
  transportationToNext: TransportationCategory
}

function translateTravelViewPointFromState(travelViewPointId : string,store : IAppState) : ITravelViewPointPersistent {
  let travelViewPoint = Immutable(store.entities.travelViewPoints[travelViewPointId]).asMutable();
  let ret = {
    id : travelViewPoint.id,
    transportationToNext: travelViewPoint.transportationToNext,
    viewPoint: travelViewPoint.viewPoint
  }

  return ret;
}

function translateDailyTripFromState(dailyTripId: string,store : IAppState): IDailyTripPersistent {
  let dailyTrip = Immutable(store.entities.dailyTrips[dailyTripId]).asMutable();
  let ret = {
    id : dailyTrip.id,
    travelViewPoints: []
  }

  dailyTrip.travelViewPoints.forEach(tvp => {
    ret.travelViewPoints.push(translateTravelViewPointFromState(tvp,store));
  });

  return ret;
}

function translateTravelAgendaFromState(travelAgendaId: string,store : IAppState): ITravelAgendaPersistent  {
  let travelAgenda = Immutable(store.entities.travelAgendas[travelAgendaId]).asMutable();
  let ret = {
      id: travelAgenda.id,
      name: travelAgenda.name,
      user: travelAgenda.user,
      cover: travelAgenda.cover,
      dailyTrips: []
  };

  travelAgenda.dailyTrips.forEach(dt => {
      ret.dailyTrips.push(translateDailyTripFromState(dt,store));
  });

  return ret;
}

@Injectable()
export class TravelAgendaService {
  //#region Private member
  //#endregion

  //#region Constructor
  constructor(public _http: HttpClient) {
  }
  //#endregion

  //#region Public properties
  
  //#endregion

  //#region Public methods
  public getTravelAgenda(pagination : IPagination): Observable<IEntities> {
    return this._http.get('http://localhost:3000/travelAgendas')
    .map(records => {
      return normalize(records, [ travelAgenda ]).entities;
    })
  }

  public flushTravelAgenda(id: string, store : IAppState) : Observable<void> {
    let agenda = translateTravelAgendaFromState(id,store);
    //let state = store.entities.travelAgendas[id];
    let url : string;
    // if (state.persistentStatus == EntityPersistentStatusEnum.NEW) {
    //   url = 'http://localhost:3000/travelAgendas';
    // }
    // else {
    //   url = '';
    // }
    return this._http.post(url,[agenda])
    .map(resp => console.log(resp));
  }
  //#endregion

  //#region Private methods

  //#endregion
}

/* Middleware Calling ) => { console.log('a pre'+ action); next(action); console.log('a after') }
var b = (next) => (action) => { console.log('b pre'+ action); next(action); console.log('b after') }
var c = (next) => (action) => { console.log('c pre'+ action); next(action); console.log('c after') }
var d = (action) => { console.log('hello world' + action) }
var compose = function(...funcs) {return arg => funcs.reduceRight((composed, f) => f(composed), arg);}
compose(a,b,c)(d)('action');
*/