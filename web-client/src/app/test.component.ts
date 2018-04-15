import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICityBiz } from 'shared/@core/store/bizModel/city.biz.model';
import { SelectorService } from 'shared/@core/store/providers/selector.service';

import { AMapComponent } from './@ui/components/a-map/a-map.component';

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

  constructor(private modalService: NgbModal, public selector: SelectorService) {
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