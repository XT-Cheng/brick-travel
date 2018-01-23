import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { normalize } from 'normalizr';
import { Observable } from 'rxjs/Observable';
import { asMutable } from 'seamless-immutable';

import { IAppState } from '../../store.model';
import { IPagination } from '../entity.action';
import { EntityPersistentStatusEnum, IEntities } from '../entity.model';
import { travelAgenda } from '../entity.schema';
import { TransportationCategory } from './travelAgenda.model';

interface ITravelAgendaPersistent {
  _id: string,
  name: string,
  user: string,
  cover: string,
  dailyTrips: IDailyTripPersistent[]
};

interface IDailyTripPersistent {
  _id: string,
  travelViewPoints: ITravelViewPointPersistent[]
}

interface ITravelViewPointPersistent {
  _id: string,
  viewPoint: string,
  transportationToNext: TransportationCategory
}

function translateTravelViewPointFromState(travelViewPointId : string,store : IAppState) : ITravelViewPointPersistent {
  let travelViewPoint = asMutable(store.entities.travelViewPoints[travelViewPointId]);
  let ret = {
    _id : travelViewPoint._id,
    transportationToNext: travelViewPoint.transportationToNext,
    viewPoint: travelViewPoint.viewPoint
  }

  return ret;
}

function translateDailyTripFromState(dailyTripId: string,store : IAppState): IDailyTripPersistent {
  let dailyTrip = asMutable(store.entities.dailyTrips[dailyTripId]);
  let ret = {
    _id : dailyTrip._id,
    travelViewPoints: []
  }

  dailyTrip.travelViewPoints.forEach(tvp => {
    ret.travelViewPoints.push(translateTravelViewPointFromState(tvp,store));
  });

  return ret;
}

function translateTravelAgendaFromState(travelAgendaId: string,store : IAppState): ITravelAgendaPersistent  {
  let travelAgenda = asMutable(store.entities.travelAgendas[travelAgendaId]);
  let ret = {
      _id: travelAgenda._id,
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
    let state = store.entities.travelAgendas[id];
    let url : string;
    if (state.persistentStatus == EntityPersistentStatusEnum.NEW) {
      url = 'http://localhost:3000/travelAgendas';
    }
    else {
      url = '';
    }
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