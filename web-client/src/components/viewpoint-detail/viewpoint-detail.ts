import { AfterViewInit, Component, Input } from '@angular/core';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { InfiniteScroll } from 'ionic-angular/components/infinite-scroll/infinite-scroll';
import { ViewPointActionGenerator } from '../../modules/store/entity/viewPoint/viewPoint.action';

@Component({
  selector: 'viewpoint-detail',
  templateUrl: 'viewpoint-detail.html'
})
export class ViewPointDetailComponent implements AfterViewInit {
//#region Private member

  //#endregion

  //#region Protected member
  
  //#endregion

  //#region Protected property

  @Input() protected viewPoint : IViewPointBiz;

  //#endregion

  //#region Public property

  //#endregion

  //#region Event

  //#endregion

  //#region Constructor
  constructor(private _viewPointActionGenerator: ViewPointActionGenerator) {
    
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
   
  }
  //#endregion

  //#region Protected methods
  protected doInfinite(infiniteScroll : InfiniteScroll) {
    this._viewPointActionGenerator.loadViewPointComments({viewPointId: this.viewPoint.id},this.viewPoint.comments.length,3);
  }

  protected isFetchedAll() {
    return this.viewPoint.comments.length == this.viewPoint.countOfComments;
  }
  //#endregion
}
