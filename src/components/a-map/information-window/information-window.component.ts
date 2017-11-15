import { Component, ChangeDetectorRef, EventEmitter, Input } from '@angular/core';

import { IViewPoint } from "../../../modules/store/viewPoint/model";

@Component({
  selector: 'information-window-a',
  templateUrl: 'information-window.component.html'
})
export class InformationWindowComponent {
  //Private member
  private _viewPoint: IViewPoint;
  private _isInTrip: boolean;
  //Private member

  //Event
  public windowClickEvent: EventEmitter<IViewPoint> = new EventEmitter<IViewPoint>();
  public viewPointAdded: EventEmitter<IViewPoint> = new EventEmitter<IViewPoint>();
  public viewPointRemoved: EventEmitter<IViewPoint> = new EventEmitter<IViewPoint>();
  //Event

  //Constructor
  constructor(private _cdRef: ChangeDetectorRef) {
  }
  //Constructor

  //Public property
  public set isInTrip(isInTrip: boolean) {
    this._isInTrip = isInTrip;
  }

  public get isInTrip(): boolean {
    return this._isInTrip;
  }

  @Input()
  public set viewPoint(viewPoint: IViewPoint) {
    this._viewPoint = viewPoint;
  }

  public get viewPoint(): IViewPoint {
    return this._viewPoint;
  }
  //Public property

  //Implemented interface

  //Implemented interface

  //Public method
  public detectChanges(): void {
    this._cdRef.detectChanges();
  }
  //Public method

  //Protected method
  protected windowClicked($event: any) {
    this.windowClickEvent.emit(this._viewPoint);
  }

  protected addOrRemoveClicked($event: any) {
    if (this._isInTrip) {
      //Remove
      this._isInTrip = false;
      this.viewPointRemoved.emit(this._viewPoint);
    }
    else {
      //Add
      this._isInTrip = true;
      this.viewPointAdded.emit(this._viewPoint)
    }
  }

  protected getIconName() {
    return (this._isInTrip) ? 'remove' : 'add';
  }

  protected getStyle() {
    return {
      'background-color': (this._isInTrip) ? '#e6e0e0;' : '#ffffff;'
    }
  }
  //Protected method
}
