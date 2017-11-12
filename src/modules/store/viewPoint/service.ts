import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { normalize } from 'normalizr';
import { viewPoint } from '../schema';
import { IEntities, shapeData } from '../model';
import { IPagination } from '../action';

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
      return shapeData(normalize(records.viewPoints, [ viewPoint ]));
      //const data = normalize(records.viewPoints, [ viewPoint ]);
      //const {viewPoints,viewPointComments} = data.entities;
      // return Object.assign({},INIT_ENTITY_STATE,{
      //   viewPoints: Object.keys(viewPoints).map(key => viewPoints[key]),
      //   viewPointComments: Object.keys(viewPointComments).map(key => viewPointComments[key])
      // });
    })
  }
  //#endregion
}