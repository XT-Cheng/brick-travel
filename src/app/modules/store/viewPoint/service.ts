import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { IViewPoint, ViewPointCategory } from './model';
import { normalize } from 'normalizr';
import { viewPoint } from '../schema';

@Injectable()
export class ViewPointService {
  //#region Private member
  //#endregion

  //#region Constructor
  constructor(public _http: Http) {
  }
  //#endregion

  //#region Public properties
  
  //#endregion

  //#region Public methods
  public getViewPoints(): Observable<IViewPoint[]> {
    return this._http.get('assets/data/viewPoints.json')
    .map(resp => resp.json())
    .map(records => {
      const data = normalize(records.viewPoints, [ viewPoint ]);
      //records.viewPoints.map(this.parse);
      return new Array<IViewPoint>();
    })
  }
  //#endregion

  //#region Private methods
  // private parse(record : any): IViewPoint {
  //   return {
  //     name: record.name,
  //     thumbnail : record.thumbnail,
  //     rank : record.rank,
  //     longtitude : record.longtitude,
  //     latitude : record.latitude,
  //     address : record.address,
  //     images : record.images,
  //     description : record.description,
  //     tips : record.tips,
  //     timeNeeded : record.timeNeeded,
  //     category: record.category
  //   };
  // }
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