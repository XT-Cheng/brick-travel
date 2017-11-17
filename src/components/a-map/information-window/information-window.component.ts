import { Component, ChangeDetectorRef, Input } from '@angular/core';

import { IViewPoint } from "../../../modules/store/viewPoint/viewPoint.model";

@Component({
  selector: 'information-window-a',
  templateUrl: 'information-window.component.html'
})
export class InformationWindowComponent {
  //Private member
  private _viewPoint: IViewPoint;
  private _isInTrip: boolean;
  private _isViewMode: boolean = true;
  //Private member

  //Event
  
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

  public set isViewMode(isViewMode: boolean) {
    this._isViewMode = isViewMode;
  }

  public get isViewMode(): boolean {
    return this._isViewMode;
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
  protected getIconName() {
    return (this._isInTrip) ? 'remove' : 'add';
  }

  protected getInnerCardStyle() {
    if (this._isViewMode) return {'max-width' : 'none', 'width': '100%'};
  }

  protected getStyle() {
    return {
      'background-color': (this._isInTrip) ? '#e6e0e0;' : '#ffffff;'
    }
  }
  //Protected method
}
