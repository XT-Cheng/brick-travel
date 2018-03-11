import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'bricktravel-modal',
  templateUrl: 'modal.component.html',
  styleUrls: [`./modal.component.scss`]
})
export class ModalComponent {

  modalHeader: string;
  modalContent : string;

  constructor(private activeModal: NgbActiveModal) { }

  confirm() {
    this.activeModal.close();
  }

  reject() {
    this.activeModal.dismiss();
  }
}
