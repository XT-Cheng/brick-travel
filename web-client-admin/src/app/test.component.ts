import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICityBiz } from './@core/store/bizModel/model/city.biz.model';
import { CityService } from './@core/store/providers/city.service';
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

  constructor(private _modalService: NgbModal, public _cityService: CityService) {
    this._cityService.all$.subscribe(cities => {
      this.city = cities[0];
    });
  }

  //#endregion

  //#region Pubic methods
  test() {
    // nb-layout
    const activeModal = this._modalService.open(AMapComponent, { backdrop: true, size: 'lg', container: '.scrollable-container' });
    activeModal.componentInstance.minHeight = 500;
    activeModal.componentInstance.allowSelectPoint = true;
  }
  //#endregion
}
