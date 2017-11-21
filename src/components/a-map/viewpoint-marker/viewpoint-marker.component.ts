import { Component, ChangeDetectorRef } from '@angular/core';

import { IViewPoint, ViewPointCategory } from "../../../modules/store/entity/viewPoint/viewPoint.model";

@Component({
  selector: 'viewpoint-marker-a',
  templateUrl: 'viewpoint-marker.component.html'
})
export class ViewPointMarkerComponent {
  //#region Private member
  public static readonly WIDTH : number = 48;
  public static readonly HEIGHT : number = 48;

  private _viewPoint: IViewPoint = null;
  private _isInTrip: boolean;
  private _sequence: number;
  //#endregion

  //Constructor
  constructor(private _cdRef: ChangeDetectorRef) {
  }
  //Constructor

  //Public property
  public set viewPoint(viewPoint: IViewPoint) {
    this._viewPoint = viewPoint;
  }

  public set isInTrip(isInTrip: boolean) {
    this._isInTrip = isInTrip;
  }

  public get isInTrip(): boolean {
    return this._isInTrip;
  }

  public set sequence(sequence: number) {
    this._sequence = sequence;
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
  protected getSequenceDisplay() : string {
    return this._isInTrip?(this._sequence + 1).toString():'';
  }

  protected getOuterClass() {
    return {
      'icon-stack-normal': true,
      'icon-map2':  true
    }
  }

  protected getInnerClass() {
    if (this._viewPoint === null)
      return {
        'icon-icon': false,
        'icon-restaurant': true,
        'icon-hotel': true,
        'icon-stack-small': true
      };

    if (this._isInTrip)
      return this.getInnerClassOfTravelViewPoint();

    return this.getInnerClassOfViewPoint();
  }

  protected getSpanClass() {
    return {
      'iconfont': true,
      'icon-stack': true
    };
  }

  protected getStyle() {
    if (this._isInTrip)
      return {
        'color': 'green',
        'width': `${ViewPointMarkerComponent.WIDTH}px`,
        'height': `${ViewPointMarkerComponent.HEIGHT}px`,
      };
    
    let color: string;
    switch (this._viewPoint.category) {
      case ViewPointCategory.View:
        color = 'blue';
        break;
      case ViewPointCategory.Shopping:
        color = 'red';
        break;
      default:
        color = 'green';
    }

    return {
      'color': color,
      'width': `${ViewPointMarkerComponent.WIDTH}px`,
      'height': `${ViewPointMarkerComponent.HEIGHT}px`,
    };
  }
  //Protected method

  //Private method
  private getInnerClassOfViewPoint() {
    let isView, isShopping, isRestaurant: boolean;
    switch (this._viewPoint.category) {
      case ViewPointCategory.View:
        isView = true;
        break;
      case ViewPointCategory.Shopping:
        isShopping = true;
        break;
      default:
        isRestaurant = true;
    }

    return {
      'icon-icon': isShopping,
      'icon-restaurant': isRestaurant,
      'icon-hotel': isView,
      'icon-stack-small': true
    };
  }

  private getInnerClassOfTravelViewPoint() {
    return {
      'trip': true
    };
  }
  //Private method
}
