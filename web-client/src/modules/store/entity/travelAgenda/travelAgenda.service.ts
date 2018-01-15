import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { normalize } from 'normalizr';
import { Observable } from 'rxjs/Observable';
import { asMutable } from 'seamless-immutable';

import { IAppState } from '../../store.model';
import { IPagination } from '../entity.action';
import { IEntities } from '../entity.model';
import { travelAgenda } from '../entity.schema';

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
    let agenda = asMutable(store.entities.travelAgendas[id],{deep: true});
    agenda.dailyTrips = agenda.dailyTrips.map(dt => {
      return asMutable(store.entities.dailyTrips[dt],{deep: true});
    });
    agenda.dailyTrips.forEach(dt => {
      dt.travelViewPoints = dt.travelViewPoints.map(tvp => {
        return asMutable(store.entities.travelViewPoints[tvp],{deep: true});
      })
    });

    return this._http.post('http://localhost:3000/travelAgendas',[agenda])
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