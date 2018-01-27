import { NgRedux } from '@angular-redux/store';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { getSelectedViewPoint } from '../../bizModel/selector/ui/viewPointSelected.selector';
import { IAppState } from '../../modules/store/store.model';
import { ViewPointActionGenerator } from '../../modules/store/entity/viewPoint/viewPoint.action';

@Component({
  selector: 'page-view-point',
  templateUrl: 'view-point.page.html',
})
export class ViewPointPage {
  //#region Private member

  //#endregion

  //#region Protected member
  protected selectedViewPoint$: Observable<IViewPointBiz>;
  //#endregion

  //#region Constructor
  constructor(private _store: NgRedux<IAppState>,
              private _viewPointActionGenerator : ViewPointActionGenerator) {
      this.selectedViewPoint$ = getSelectedViewPoint(this._store);
  }

  //#endregion

  //#region Implements interface

  //#endregion

  //#region Protected method
  protected fetchMoreComments(viewPoint : IViewPointBiz) {
    this._viewPointActionGenerator.loadViewPointComments({viewPointId: viewPoint.id},viewPoint.comments.length);
  }
  //#endregion
}
