import { Injectable } from '@angular/core';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { normalize } from 'normalizr';
import { filterCategory } from '../entity.schema';
import { IEntities } from '../entity.model';
import { IPagination } from '../entity.action';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FilterCategoryService {
  //#region Private member
  //#endregion

  //#region Constructor
  constructor(public _http: HttpClient) {
  }
  //#endregion

  //#region Public properties
  
  //#endregion

  //#region Public methods
  public getFilterCategory(pagination : IPagination): Observable<IEntities> {
    return this._http.get('http://localhost:3000/filterCategories')
    .map(records => {
      return normalize(records, [ filterCategory ]).entities;
    })
  }
  //#endregion
}