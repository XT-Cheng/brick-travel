import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { normalize } from 'normalizr';
import { Observable } from 'rxjs/Observable';

import { IPagination, IQueryCondition } from '../entity.action';
import { IEntities } from '../entity.model';
import { viewPoint } from '../entity.schema';

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

  public getViewPointComments(pagination : IPagination, queryCondition : IQueryCondition): Observable<IEntities> {
    let url = `http://localhost:3000/viewPoints/${queryCondition['viewPointId']}/comments?skip=${pagination.page}&&limit=${pagination.limit}`;
    
    return this._http.get(url)
    .map(records => {
      return normalize(records, viewPoint).entities;
    })
  }
  //#endregion
}