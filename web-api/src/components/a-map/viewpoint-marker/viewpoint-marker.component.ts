import { Component, ChangeDetectorRef, Input } from '@angular/core';

import { ViewPointCategory } from "../../../modules/store/entity/viewPoint/viewPoint.model";
import { IViewPointBiz } from '../../../bizModel/model/viewPoint.biz.model';

@Component({
  selector: 'viewpoint-marker-a',
  templateUrl: 'viewpoint-marker.component.html'
})
export class ViewPointMarkerComponent {
  //#region Private member
  public static readonly WIDTH: number = 48;
  public static readonly HEIGHT: number = 48;

  //#endregion

  //Constructor
  constructor(private _cdRef: ChangeDetectorRef) {
  }
  //Constructor

  //Public property

  @Input() public viewPoint: IViewPointBiz;
  @Input() public sequence: number;
  @Input() public inCurrentTrip: boolean;

  //Public property

  //Implemented interface

  //Implemented interface

  //Public method
  public detectChanges(): void {
    this._cdRef.detectChanges();
  }
  //Public method

  //Protected method
  protected getSequenceDisplay(): string {
    return this.inCurrentTrip ? (this.sequence + 1).toString() : '';
  }

  protected getOuterClass() {
    return {
      'icon-stack-normal': true,
      'icon-map2': true
    }
  }

  protected getInnerClass() {
    if (this.viewPoint === null)
      return {
        'icon-icon': false,
        'icon-restaurant': true,
        'icon-hotel': true,
        'icon-stack-small': true
      };

    if (this.inCurrentTrip)
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
    let color: string;

    switch (this.viewPoint.category) {
      case ViewPointCategory.View:
        color = 'blue';
        break;
      case ViewPointCategory.Shopping:
        color = 'red';
        break;
      default:
        color = 'green';
    }

    if (this.inCurrentTrip)
      color = 'green';

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
    switch (this.viewPoint.category) {
      case ViewPointCategory.View:
        isView = true;
        break;
      case ViewPointCategory.Food:
        isRestaurant = true;
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
