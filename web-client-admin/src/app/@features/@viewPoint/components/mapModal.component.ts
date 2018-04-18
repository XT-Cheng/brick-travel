import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICityBiz } from '../../../@core/store/bizModel/city.biz.model';

@Component({
  selector: 'bt-map-modal',
  templateUrl: 'mapModal.component.html',
  styleUrls: [`./mapModal.component.scss`]
})
export class MapModalComponent {
  @Input() city: ICityBiz;
  @Input() minHeight: number;
  @Input() pointChoosed: AMap.LngLat;

  constructor(private activeModal: NgbActiveModal) { }

  confirm() {
    this.activeModal.close();
  }

  reject() {
    this.activeModal.dismiss();
  }

  onPointChoosed(pos: AMap.LngLat) {
    this.activeModal.close(pos);
  }
}
