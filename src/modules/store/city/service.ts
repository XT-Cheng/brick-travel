import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { normalize } from 'normalizr';
import { city } from '../schema';
import { IEntities } from '../model';
import { IPagination } from '../action';

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
  public getCities(pagination : IPagination): Observable<IEntities> {
    let jsonFile = (pagination.page == 0)?'assets/data/cities.json':'assets/data/cities.page.json'
    return this._http.get(jsonFile)
    .map(resp => resp.json())
    .map(records => {
      return normalize(records.cities, [ city ]).entities;
    })
  }
  //#endregion

  //#region Private methods

  //#endregion
}