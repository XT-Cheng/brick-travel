import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { normalize } from 'normalizr';
import { viewPoint } from '../entity.schema';
import { IEntities } from '../entity.model';
import { IPagination, IQueryCondition } from '../entity.action';

@Injectable()
export class ViewPointService {
  //#region Private member
  //#endregion

  //#region Constructor
  constructor(public _http: HttpClient) {
  }
  //#endregion

  //#region Public properties
  
  //#endregion

  //#region Public methods
  public getViewPoints(pagination : IPagination, queryCondition : IQueryCondition): Observable<IEntities> {
    let url = 'http://localhost:3000/';
    if (queryCondition) {
      url += queryCondition['cityId'];
      url += '/viewPoints';;
    }
    else {
      url += 'viewPoints';
    }
    
    return this._http.get(url)
    .map(records => {
      return normalize(records, [ viewPoint ]).entities;
    })
  }
  //#endregion
}