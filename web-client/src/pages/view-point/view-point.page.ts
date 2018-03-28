import { Component } from '@angular/core';

import { IViewPointBiz } from '../../shared/@core/store/bizModel/viewPoint.biz.model';
import { SelectorService } from '../../shared/@core/store/providers/selector.service';
import { ViewPointService } from '../../shared/@core/store/providers/viewPoint.service';

@Component({
  selector: 'page-view-point',
  templateUrl: 'view-point.page.html',
})
export class ViewPointPage {
  //#region Private member

  //#endregion

  //#region Protected member
  
  //#endregion

  //#region Constructor
  constructor(private _viewPointService : ViewPointService,
    protected selector:SelectorService,) {
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
