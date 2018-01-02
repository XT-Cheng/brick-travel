import { ChangeDetectorRef, Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { IViewPointBiz } from '../../../bizModel/model/viewPoint.biz.model';
import { ActionAllowed } from '../a-map.component';

@Component({
  selector: 'information-window-a',
  templateUrl: 'information-window.component.html'
})
export class InformationWindowComponent {
  //Private member

  //Private member

  //Event
  @Output() viewPointClickedEvent : Subject<IViewPointBiz>;
  @Output() viewPointAddedEvent: Subject<IViewPointBiz>;
  @Output() viewPointRemovedEvent: Subject<IViewPointBiz>;
  
  //Event

  //Constructor
  constructor(private _cdRef: ChangeDetectorRef) {
    this.viewPointClickedEvent = new Subject<IViewPointBiz>();
    this.viewPointAddedEvent = new Subject<IViewPointBiz>();
    this.viewPointRemovedEvent = new Subject<IViewPointBiz>();
  }
  //Constructor

  //Public property

  @Input() public actionAllowed: ActionAllowed;
  @Input() public viewPoint: IViewPointBiz;

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
    return this.actionAllowed === ActionAllowed.REMOVE ? 'remove' : 'add';
  }

  protected getStyle() {
    return {
      'background-color': this.actionAllowed === ActionAllowed.NONE ? '#ffffff;' : '#e6e0e0;'
    }
  }

  protected displayButton() : boolean {
    return this.actionAllowed !== ActionAllowed.NONE;
  }

  protected viewPointClicked(viewPoint : IViewPointBiz) {
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
  //Protected method
}
