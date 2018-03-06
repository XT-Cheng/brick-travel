import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SelectorService } from '../../../store/providers/selector.service';
import { CityService } from '../../../store/providers/city.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICityBiz } from '../../../store/bizModel/city.biz.model';
import { ObjectID } from 'bson';

export enum EntityFormMode {
  create,
  edit
}

@Component({
  selector: 'bricktravel-city-form',
  templateUrl: 'city.form.component.html',
  styleUrls: ['./city.form.component.scss']
})
export class CityFormComponent {
  private init: ICityBiz = {
    name: '',
    thumbnail: '',
    adressCode: '',
    id: ''
  };
  submitted: boolean = false;
  constructor(private _cityService: CityService,
    private activeModal: NgbActiveModal) {
    this.city = this.init;
  }

  @Input()
  mode : EntityFormMode = EntityFormMode.create;

  @Input()
  city: ICityBiz;

  @Input()
  title : string = 'Create City';

  @ViewChild('focus') cityNameElement: ElementRef;

  ngAfterViewInit() {
    this.cityNameElement.nativeElement.focus();
  }

  create() {
    this.submitted = true;
    if (this.mode == EntityFormMode.create) {
      this._cityService.addCity({
        id: new ObjectID().toHexString(),
        name: this.city.name,
        thumbnail: 'assets/img/IMG_4202.jpg',
        adressCode: 'address'
      });
    }
    else {
      this._cityService.updateCity(this.city);
    }
    this.activeModal.close();
  }

  close() {
    this.activeModal.close();
  }
}
