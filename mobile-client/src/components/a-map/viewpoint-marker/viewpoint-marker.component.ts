import { Component, ChangeDetectorRef, Input } from '@angular/core';

import { IViewPointBiz } from 'shared/@core/store/bizModel/viewPoint.biz.model';

@Component({
  selector: 'bt-vp-marker-a',
  templateUrl: 'viewpoint-marker.component.html'
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
  protected hasViewPoint() : boolean {
    return !!this.viewPoint;
  }

  protected getSequenceDisplay(): string {
    return this.inCurrentTrip ? (this.sequence + 1).toString() : '';
  }

  protected getDisplay() {
    if (!this.viewPoint)
      return '';
    if (this.inCurrentTrip)
      return 'trip';
    return this.getViewPointDisplay();
  }

  protected getStyle() {
    let color: string;

    if (!this.viewPoint)
      color = '39a73c';
    else {
      switch (this.viewPoint.category.name) {
        case 'View':
          color = '#0517ec';
          break;
        case 'Food':
          color = '#00c4ff';
          break;
        case 'Humanities':
          color = '#c000ff';
          break;
        case 'Transportation':
          color = '#6eff00';
          break;
        case 'Shopping':
          color = '#ff8d00';
          break;
        case 'Lodging':
          color = '#643a67';
          break;
        default:
          color = '#0517ec';
      }
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
    switch (this.viewPoint.category.name) {
      case 'View':
        return 'view';
      case 'Food':
        return 'food';
      case 'Humanities':
        return 'humanities';
      case 'Transportation':
        return 'transportation';
      case 'Shopping':
        return 'shopping';
      case 'Lodging':
        return 'lodging';
      default:
        return 'view';
    }
  }
  //Private method
}
