import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { IDailyTripBiz } from '../../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { ActionAllowed } from '../a-map/a-map.component';

@Component({
  selector: 'viewpoint-list',
  templateUrl: 'viewpoint-list.component.html'
})
export class ViewPointListComponent implements AfterViewInit, OnDestroy {
  //#region Protected member

  //#endregion

  //#region Private member

  //#endregion

  //#region Event
  @Output() viewPointClickedEvent : EventEmitter<IViewPointBiz>;
  //#endregion

  //#region Constructor
  constructor() {
    this.viewPointClickedEvent = new EventEmitter<IViewPointBiz>();
  }
  //#endregion

  //#region Protected property
  @Input() protected viewMode: boolean;
  @Input() protected viewPoints: Array<IViewPointBiz>;
  @Input() protected dailyTrip: IDailyTripBiz;

  //#endregion

  //#region Public property

  //#endregion

  //#region Implements interface
  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
  }
  //#endregion Implements interface

  //#region Public method

  //#endregion

  //#region Protected method
  protected clicked($event: any, viewPoint: IViewPointBiz) {
    //this.viewPointClicked.emit(viewPoint);
  }

  protected addOrRemove(viewPoint: IViewPointBiz) {
    // if (this._viewMode) return;

    // if (this.isInTrip(viewPoint)) {
    //   let travelViewPoints = this._dailyTrip.travelViewPoints;
    //   //Remove
    //   for (let index = 0; index < travelViewPoints.length; index++) {
    //     let vp = travelViewPoints[index].viewPoint;
    //     if (vp.longtitude === viewPoint.longtitude && vp.latitude === viewPoint.latitude) {
    //       travelViewPoints.splice(index, 1);
    //     }
    //   }
    // }
    // else {
    //   //Add
    //   for (let index = 0; index < this._viewPoints.length; index++) {
    //     let vp = this._viewPoints[index];
    //     if (vp.longtitude === viewPoint.longtitude && vp.latitude === viewPoint.latitude) {
    //       let travleViewPoint = new TravelViewPoint();
    //       travleViewPoint.viewPoint = viewPoint;
    //       this._dailyTrip.travelViewPoints.push(travleViewPoint);
    //     }
    //   }
    // }
  }

  protected getIconName(viewPoint: IViewPointBiz) {
    return this.actionAllowed(viewPoint) === ActionAllowed.REMOVE ? 'remove' : 'add';
  }

  // protected getInnerCardStyle() {
  //   if (this.actionAllowed) return {'max-width' : 'none', 'width': '100%'};
  // }

  protected getStyle(viewPoint: IViewPointBiz) {
    return {
      'background-color': this.actionAllowed(viewPoint) === ActionAllowed.NONE ? '#ffffff;' : '#e6e0e0;'
    }
  }

  protected displayButton(viewPoint: IViewPointBiz): boolean {
    return this.actionAllowed(viewPoint) !== ActionAllowed.NONE;
  }

  protected viewPointClicked(viewPoint : IViewPointBiz) {
    this.viewPointClickedEvent.emit(viewPoint);
  }

  //#endregion

  //#region Private method
  private isInCurrentTrip(viewPoint: IViewPointBiz): boolean {
    let ret = false;

    if (this.dailyTrip) {
      this.dailyTrip.travelViewPoints.forEach(tvp => {
        if (viewPoint.id === tvp.viewPoint.id)
          ret = true;
      });
    }

    return ret;
  }

  private actionAllowed(viewPoint: IViewPointBiz): ActionAllowed {
    if (!this.viewMode && this.dailyTrip) {
        if (this.isInCurrentTrip(viewPoint))
          return ActionAllowed.REMOVE;
        return ActionAllowed.ADD;
    }

    return ActionAllowed.NONE;
  }
  //#endregion
}
