import { Component } from '@angular/core';

import { IViewPointBiz } from '../../modules/store/bizModel/model/viewPoint.biz.model';
import { SelectorService } from '../../modules/store/providers/selector.service';
import { ViewPointService } from '../../modules/store/providers/viewPoint.service';

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
