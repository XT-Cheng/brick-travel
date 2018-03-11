import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { SelectorService } from '../../../../store/providers/selector.service';
import { CityService } from '../../../../store/providers/city.service';
import { ComponentType } from '../../pages.component';
import { CityFormComponent, EntityFormMode } from '../form/city.form.component';
import { ICityBiz } from '../../../../store/bizModel/city.biz.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modal.component';

@Component({
  selector: 'bricktravel-city-list',
  templateUrl: 'city.list.component.html',
  styleUrls: ['./city.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CityListComponent implements ComponentType {

  constructor(protected _selector: SelectorService, private modalService: NgbModal, private _cityService: CityService) {
    this._cityService.load();
  }

  createEntity() {
    const activeModal =this.modalService.open(CityFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.city = {
      name: '',
      thumbnail: '',
      adressCode: '',
      id: ''
    };
  }

  edit(city: ICityBiz) {
    const activeModal = this.modalService.open(CityFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.city = Object.assign({}, city);
    activeModal.componentInstance.title = 'Edit City';
    activeModal.componentInstance.mode = EntityFormMode.edit;
  }

  delete(city: ICityBiz) {
    const activeModal = this.modalService.open(ModalComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = `Confrim`;
    activeModal.componentInstance.modalContent = `Delete city : ${city.name} ?`;

    activeModal.result.then((result) => {
      this._cityService.deleteCity(city);
    }, (reason) => {
      //nothing to do
    });
  }
}
