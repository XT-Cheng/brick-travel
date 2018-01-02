import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { normalize } from 'normalizr';
import { viewPoint } from '../entity.schema';
import { IEntities } from '../entity.model';
import { IPagination } from '../entity.action';

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
    //let url = (pagination.page == 0)?'assets/data/viewPoints.json':'assets/data/viewPoints.page.json'
    let url = 'http://localhost:3000/viewPoint'
    return this._http.get(url).map(resp => {
      return resp.json()
    })
    .map(records => {
      return normalize(records, [ viewPoint ]).entities;
    })
  }
  //#endregion
}