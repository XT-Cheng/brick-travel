import { ChangeDetectorRef, Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { IViewPointBiz } from '../../../../@core/store/bizModel/viewPoint.biz.model';

export enum ActionAllowed {
  ADD,
  REMOVE,
  NONE
}

@Component({
  selector: 'bt-information-window-a',
  templateUrl: 'information-window.component.html',
  styleUrls: ['information-window.component.scss']
})
export class InformationWindowComponent {
  //#region Private member

  //#endregion

  //#region Event
  @Output() viewPointClickedEvent: Subject<IViewPointBiz>;
  @Output() viewPointAddedEvent: Subject<IViewPointBiz>;
  @Output() viewPointRemovedEvent: Subject<IViewPointBiz>;

  //#endregion

  //#region Constructor
  constructor(private _cdRef: ChangeDetectorRef) {
    this.viewPointClickedEvent = new Subject<IViewPointBiz>();
    this.viewPointAddedEvent = new Subject<IViewPointBiz>();
    this.viewPointRemovedEvent = new Subject<IViewPointBiz>();
  }
  //#endregion

  //#region Public property

  @Input() public actionAllowed: ActionAllowed;
  @Input() public viewPoint: IViewPointBiz;
  //#endregion

  //#region Implemented interface

  //#endregion

  //#region Public method
  detectChanges(): void {
    this._cdRef.detectChanges();
  }

  getStyle() {
    return {
      'background-color': this.actionAllowed === ActionAllowed.NONE ? '#ffffff;' : '#e6e0e0;'
    }
  }

  //#endregion

  //#region Protected method
  protected getIconName() {
    return this.actionAllowed === ActionAllowed.REMOVE ? 'remove' : 'add';
  }


  protected displayButton(): boolean {
    return this.actionAllowed !== ActionAllowed.NONE;
  }

  protected viewPointClicked(viewPoint: IViewPointBiz) {
    this.viewPointClickedEvent.next(viewPoint);
  }

  protected addOrRemove(viewPoint: IViewPointBiz) {
    if (this.actionAllowed == ActionAllowed.ADD) {
      this.viewPointAddedEvent.next(viewPoint);
    }
    else {
      this.viewPointRemovedEvent.next(viewPoint);
    }
  }

  //#endregion
}
