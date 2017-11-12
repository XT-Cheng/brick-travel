import { Component, ChangeDetectorRef } from '@angular/core';

import { IViewPoint, ViewPointCategory } from "../../../modules/store/viewPoint/model";

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
  protected getOuterClass() {
    return {
      'icon-stack-normal': true,
      'icon-map2': !this._isInTrip,
      'icon-map4': this._isInTrip
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
      'icon-stack': !this._isInTrip,
      'icon-stack-trip': this._isInTrip
    };
  }

  protected getStyle() {
    if (this._viewPoint === null)
      return {
        'color': 'black',
        'width': `${ViewPointMarkerComponent.WIDTH}px`,
        'height': `${ViewPointMarkerComponent.HEIGHT}px`,
      };

    if (this._isInTrip) return;
    
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
      'width': '48px',
      'height': '48px'
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
      'icon-stack-small-trip': true,
      'icon-shuzi1': this._sequence === 0,
      'icon-shuzi2': this._sequence === 1,
      'icon-shuzi3': this._sequence === 2,
      'icon-shuzi': this._sequence === 3,
      'icon-shuzi5': this._sequence === 4,
      'icon-shuzi4': this._sequence === 5,
      'icon-shuzi7': this._sequence === 6,
      'icon-shuzi8': this._sequence === 7,
      'icon-shuzi9': this._sequence === 8,
    };
  }
  //Private method
}
