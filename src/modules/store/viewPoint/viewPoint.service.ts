import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { normalize } from 'normalizr';
import { viewPoint } from '../store.schema';
import { IEntities } from '../store.model';
import { IPagination } from '../store.action';

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
  public getViewPoints(pagination : IPagination): Observable<IEntities> {
    let jsonFile = (pagination.page == 0)?'assets/data/viewPoints.json':'assets/data/viewPoints.page.json'
    return this._http.get(jsonFile).map(resp => resp.json())
    .map(records => {
      return normalize(records.viewPoints, [ viewPoint ]).entities;
    })
  }
  //#endregion
}