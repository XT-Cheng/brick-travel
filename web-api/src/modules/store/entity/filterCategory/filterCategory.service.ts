import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { normalize } from 'normalizr';
import { filterCategory } from '../entity.schema';
import { IEntities } from '../entity.model';
import { IPagination } from '../entity.action';

@Injectable()
export class FilterCategoryService {
  //#region Private member
  //#endregion

  //#region Constructor
  constructor(public _http: Http) {
  }
  //#endregion

  //#region Public properties
  
  //#endregion

  //#region Public methods
  public getFilterCategory(pagination : IPagination): Observable<IEntities> {
    let jsonFile = 'assets/data/filterCategories.json';
    return this._http.get(jsonFile).map(resp => resp.json())
    .map(records => {
      return normalize(records.filterCategories, [ filterCategory ]).entities;
    })
  }
  //#endregion
}