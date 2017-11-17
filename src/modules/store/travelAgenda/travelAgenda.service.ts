import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { normalize } from 'normalizr';
import { travelAgenda } from '../store.schema';
import { IEntities } from '../store.model';
import { IPagination } from '../store.action';

@Injectable()
export class TravelAgendaService {
  //#region Private member
  //#endregion

  //#region Constructor
  constructor(public _http: Http) {
  }
  //#endregion

  //#region Public properties
  
  //#endregion

  //#region Public methods
  public getTravelAgenda(pagination : IPagination): Observable<IEntities> {
    let jsonFile = 'assets/data/travelAgendas.json'
    return this._http.get(jsonFile)
    .map(resp => resp.json())
    .map(records => {
      return normalize(records.travelAgendas, [ travelAgenda ]).entities;
    })
  }
  //#endregion

  //#region Private methods

  //#endregion
}

/* Middleware Calling
var a = (next) => (action) => { console.log('a pre'+ action); next(action); console.log('a after') }
var b = (next) => (action) => { console.log('b pre'+ action); next(action); console.log('b after') }
var c = (next) => (action) => { console.log('c pre'+ action); next(action); console.log('c after') }
var d = (action) => { console.log('hello world' + action) }
var compose = function(...funcs) {return arg => funcs.reduceRight((composed, f) => f(composed), arg);}
compose(a,b,c)(d)('action');
*/