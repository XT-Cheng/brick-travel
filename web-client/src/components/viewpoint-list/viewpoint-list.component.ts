import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import * as uuid from 'uuid';

import { IDailyTripBiz, ITravelViewPointBiz, ITravelAgendaBiz } from '../../bizModel/model/travelAgenda.biz.model';
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
  @Output() viewPointClickedEvent: EventEmitter<IViewPointBiz>;
  @Output() viewPointAddedToDailyTrip: EventEmitter<{dailyTrip: IDailyTripBiz,travelAgenda : ITravelAgendaBiz,added: ITravelViewPointBiz}>;
  @Output() viewPointRemovedFromDailyTrip: EventEmitter<{dailyTrip: IDailyTripBiz,travelAgenda : ITravelAgendaBiz,removed: ITravelViewPointBiz}>;
  
  //#endregion

  //#region Constructor
  constructor() {
    this.viewPointClickedEvent = new EventEmitter<IViewPointBiz>();
    this.viewPointAddedToDailyTrip = new EventEmitter<{dailyTrip: IDailyTripBiz,travelAgenda : ITravelAgendaBiz,added: ITravelViewPointBiz}>();
    this.viewPointRemovedFromDailyTrip = new EventEmitter<{dailyTrip: IDailyTripBiz,travelAgenda : ITravelAgendaBiz,removed: ITravelViewPointBiz}>();
  }
  //#endregion

  //#region Protected property
  @Input() protected viewMode: boolean;
  @Input() protected viewPoints: Array<IViewPointBiz>;
  @Input() protected dailyTrip: IDailyTripBiz;
  @Input() protected travelAgenda : ITravelAgendaBiz;

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

  protected addOrRemove(viewPoint: IViewPointBiz) {
    if (this.actionAllowed(viewPoint) == ActionAllowed.ADD) {
      //Create travel viewPoint
      let travelViewPoint: ITravelViewPointBiz = {
        id: uuid.v1(),
        viewPoint: viewPoint,
        distanceToNext: -1,
        transportationToNext: null
      };
      this.dailyTrip.travelViewPoints.push(travelViewPoint);
      this.viewPointAddedToDailyTrip.emit({dailyTrip: this.dailyTrip,travelAgenda : this.travelAgenda,added: travelViewPoint})
    }
    else {
      let removed = this.dailyTrip.travelViewPoints.find(tvp => tvp.viewPoint.id == viewPoint.id)
      this.dailyTrip.travelViewPoints =
        this.dailyTrip.travelViewPoints.filter(tvp => tvp.viewPoint.id != viewPoint.id);
        this.viewPointRemovedFromDailyTrip.emit({dailyTrip: this.dailyTrip,travelAgenda : this.travelAgenda,removed: removed})
    }
  }

  protected getIconName(viewPoint: IViewPointBiz) {
    return this.actionAllowed(viewPoint) === ActionAllowed.REMOVE ? 'remove' : 'add';
  }
  
  protected getStyle(viewPoint: IViewPointBiz) {
    return {
      'background-color': this.actionAllowed(viewPoint) === ActionAllowed.NONE ? '#ffffff;' : '#e6e0e0;'
    }
  }

  protected displayButton(viewPoint: IViewPointBiz): boolean {
    return this.actionAllowed(viewPoint) !== ActionAllowed.NONE;
  }

  protected viewPointClicked(viewPoint: IViewPointBiz) {
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
