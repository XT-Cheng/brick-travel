import { ActivatedRoute, Router } from "@angular/router";
import { SelectorService } from "shared/@core/store/providers/selector.service";
import { Component } from '@angular/core';
import { ICityBiz } from "shared/@core/store/bizModel/city.biz.model";
import { IViewPointBiz } from "shared/@core/store/bizModel/viewPoint.biz.model";
import { ViewPointService } from "shared/@core/store/providers/viewPoint.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AMapComponent } from "shared/@core/a-map/components/a-map.component";


// <bt-a-map [allowSelectPoint]='true' [city]='city' [viewPoints]='selector.filterAndSearchedViewPoints$ | async'>
// </bt-a-map>
@Component({
  selector: 'bt-test',
  template: `
  <button type="button" (click)='test()' class="btn btn-primary btn-icon">
    <i class="nb-plus"></i>
  </button>
`
})
export class TestComponent {
  //#region Private members

  //#endregion

  //#region Public members
  city: ICityBiz;
  //#endregion

  //#region Interface implementation

  //#endregion

  //#region Constructor  

  constructor(private route: ActivatedRoute,private modalService: NgbModal,
    private router: Router, public selector: SelectorService, private _viewPointService: ViewPointService) {
    this.selector.cities$.subscribe(cities => {
      this.city = cities[0];
    })
  }

  //#endregion

  //#region Pubic methods
  test() {
    //nb-layout
    const activeModal = this.modalService.open(AMapComponent, { backdrop: true, size: 'lg', container: '.scrollable-container' });
    activeModal.componentInstance.minHeight = 500;
    activeModal.componentInstance.allowSelectPoint = true;
  }
  //#endregion
}