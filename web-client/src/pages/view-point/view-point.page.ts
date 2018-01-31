import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { SelectorService } from '../../providers/selector.service';
import { ViewPointService } from '../../providers/viewPoint.service';

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
  constructor(private _selector:SelectorService,
              private _viewPointService : ViewPointService) {
      this.selectedViewPoint$ = this._selector.selectedViewPoint;
  }

  //#endregion

  //#region Implements interface

  //#endregion

  //#region Protected method
  protected fetchMoreComments(viewPoint : IViewPointBiz) {
    this._viewPointService.loadComments({viewPointId: viewPoint.id},viewPoint.comments.length);
  }
  //#endregion
}
