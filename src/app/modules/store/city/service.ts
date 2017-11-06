import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { ICity } from './models';

@Injectable()
export class CityService {
  //#region Private member
  //#endregion

  //#region Constructor
  constructor(public _http: Http) {
  }
  //#endregion

  //#region Public properties
  
  //#endregion

  //#region Public methods
  public getCities(): Observable<ICity[]> {
    return this._http.get('assets/data/cities.json')
    .map(resp => resp.json())
    .map(records => records.cities.map(this.parse));
  }
  //#endregion

  //#region Private methods
  private parse(record : any): ICity {
    return {
        id: '1',
        name: record.name,
        thumbnail: record.thumbnail
    };
  }
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