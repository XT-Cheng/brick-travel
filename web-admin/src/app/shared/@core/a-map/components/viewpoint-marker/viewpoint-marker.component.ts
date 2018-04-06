import { Component, ChangeDetectorRef, Input } from '@angular/core';

import { ViewPointCategory } from "../../../store/entity/viewPoint/viewPoint.model";
import { IViewPointBiz } from '../../../store/bizModel/viewPoint.biz.model';

@Component({
  selector: 'bt-vp-marker-a',
  templateUrl: 'viewpoint-marker.component.html',
  styleUrls: ['viewpoint-marker.component.scss']
})
export class ViewPointMarkerComponent {
  //#region Private member
  public static readonly WIDTH: number = 32;
  public static readonly HEIGHT: number = 32;

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
    // return {
    //   'icon-stack-normal': true,
    //   'icon-map2': true
    // }
    return `#icon-map`
  }

  protected getDisplay() {
    if (this.inCurrentTrip)
      return 'trip';
    return this.getViewPointDisplay();
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
        color = '#0517ec';
        break;
      case ViewPointCategory.Food:
        color = '#00c4ff';
        break;
      case ViewPointCategory.Humanities:
        color = '#c000ff';
        break;
      case ViewPointCategory.Transportation:
        color = '#6eff00';
        break;
      case ViewPointCategory.Shopping:
        color = '#ff8d00';
        break;
      case ViewPointCategory.Lodging:
        color = '#643a67';
        break;
      default:
        color = '#0517ec';
    }

    if (this.inCurrentTrip)
      color = '#39a73c';

    return {
      'color': color,
      'width': `${ViewPointMarkerComponent.WIDTH}px`,
      'height': `${ViewPointMarkerComponent.HEIGHT}px`,
    };
  }
  //Protected method

  //Private method
  private getViewPointDisplay() {
    let isView, isShopping, isRestaurant: boolean;
    switch (this.viewPoint.category) {
      case ViewPointCategory.View:
        return 'view';
      case ViewPointCategory.Food:
        return 'food';
      case ViewPointCategory.Humanities:
        return 'humanities';
      case ViewPointCategory.Transportation:
        return 'transportation';
      case ViewPointCategory.Shopping:
        return 'shopping';
      case ViewPointCategory.Lodging:
        return 'lodging';
      default:
        return 'view';
    }
  }

  private getTravelViewPointDisplay() {
    return {
      'trip': true
    };
  }
  //Private method
}
