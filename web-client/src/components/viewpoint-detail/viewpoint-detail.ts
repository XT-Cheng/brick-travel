import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular/components/infinite-scroll/infinite-scroll';

import { IViewPointBiz } from '../../modules/store/bizModel/model/viewPoint.biz.model';

@Component({
  selector: 'viewpoint-detail',
  templateUrl: 'viewpoint-detail.html'
})
export class ViewPointDetailComponent implements AfterViewInit {
  //#region Private member
  private _viewPoint : IViewPointBiz;

  @ViewChild(InfiniteScroll) private _infinteScroll: InfiniteScroll;
  
  //#endregion

  //#region Protected member
  
  //#endregion

  //#region Protected property

  @Input() protected set viewPoint(value : IViewPointBiz) {
    this._viewPoint = value;
    if (this._infinteScroll)
      this._infinteScroll.complete();
  }
  protected get viewPoint() : IViewPointBiz {
    return this._viewPoint;
  }

  //#endregion

  //#region Public property

  //#endregion

  //#region Event
  @Output() protected fetchMoreCommentsEvent: EventEmitter<IViewPointBiz>;
  //#endregion

  //#region Constructor
  constructor() {
    this.fetchMoreCommentsEvent = new EventEmitter<IViewPointBiz>();
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
   
  }
  //#endregion

  //#region Protected methods
  protected doInfinite(infiniteScroll : InfiniteScroll) {
    this.fetchMoreCommentsEvent.emit(this._viewPoint);
  }

  protected isFetchedAll() {
    return this._viewPoint.comments.length == this._viewPoint.countOfComments;
  }
  //#endregion
}
