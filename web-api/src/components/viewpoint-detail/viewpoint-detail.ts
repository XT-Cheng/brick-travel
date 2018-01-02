import { AfterViewInit, Component, Input } from '@angular/core';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';

@Component({
  selector: 'viewpoint-detail',
  templateUrl: 'viewpoint-detail.html'
})
export class ViewPointDetailComponent implements AfterViewInit {
//#region Private member

  //#endregion

  //#region Protected member
  
  //#endregion

  //#region Protected property

  @Input() protected viewPoint : IViewPointBiz;

  //#endregion

  //#region Public property

  //#endregion

  //#region Event

  //#endregion

  //#region Constructor
  constructor() {
    
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
   
  }
  //#endregion

  //#region Protected methods
  
  //#endregion
}
