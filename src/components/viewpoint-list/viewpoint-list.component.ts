import { NgRedux } from '@angular-redux/store';
import { AfterViewInit, Component, Input } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { IDailyTrip } from '../../modules/store/entity/travelAgenda/travelAgenda.model';
import { IViewPoint } from '../../modules/store/entity/viewPoint/viewPoint.model';
import { getViewPoints } from '../../modules/store/entity/viewPoint/viewPoint.selector';
import { IAppState } from '../../modules/store/store.model';

@Component({
  selector: 'viewpoint-list',
  templateUrl: 'viewpoint-list.component.html'
})
export class ViewPointListComponent implements AfterViewInit, OnDestroy {
  //#region Protected member
  
  //#endregion

  //#region Private member
  private _unSubs : Array<Subscription> = new Array<Subscription>();
  private _viewPoints$: Observable<Array<IViewPoint>>;
  //#endregion

  //#region Event
  
  //#endregion

  //#region Constructor
  constructor(private _store: NgRedux<IAppState>) {
    this._viewPoints$ = this._store.select<{ [id: string]: IViewPoint }>(['entities', 'viewPoints'])
      .map(getViewPoints(this._store));
  }
  //#endregion

  //#region Protected property

  @Input() protected viewMode : boolean ;
  @Input() protected viewPoints : Array<IViewPoint>;
  @Input() protected dailyTrip : IDailyTrip;

//#endregion

  //#region Public property

  //#endregion

//#region Implements interface
ngAfterViewInit(): void {
  this._unSubs.push(this._viewPoints$.subscribe(viewPoints => {
    this.viewPoints = viewPoints;
  }));
}

ngOnDestroy(): void {
  this._unSubs.forEach(un => un.unsubscribe());
}
//#endregion Implements interface
  
//#region Public method

  //#endregion

  //#region Protected method
  protected clicked($event: any, viewPoint: IViewPoint) {
    //this.viewPointClicked.emit(viewPoint);
  }

  protected addOrRemove(viewPoint: IViewPoint) {
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

  protected getIconName(viewPoint: IViewPoint) {
    return this.isInTrip(viewPoint) ? 'remove' : 'add';
  }

  protected getInnerCardStyle() {
    if (this.viewMode) return {'max-width' : 'none', 'width': '100%'};
  }

  protected getStyle(viewPoint: IViewPoint) {
    return {
      'background-color': this.isInTrip(viewPoint) ? '#e6e0e0' : '#ffffff'
    }
  }
  //#endregion

  //#region Private method
  private isInTrip(viewPoint: IViewPoint): boolean {
    // if (this._dailyTrip === null) return false;

    // for (let tvp of this._dailyTrip.travelViewPoints) {
    //   if (viewPoint.encode() === tvp.viewPoint.encode()) {
    //     return true;
    //   }
    // }
    return false;
  }
  //#endregion
}
