import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';

import { ICityBiz } from '../../../../../@core/store/bizModel/city.biz.model';
import { CityService } from '../../../../../@core/store/providers/city.service';
import { SelectorService } from '../../../../../@core/store/providers/selector.service';
import { SearchService } from '../../../../../@ui/providers/search.service';
import { ComponentType } from '../../../components/admin.component';
import { ModalComponent } from '../../../components/modal.component';
import { CityFormComponent, EntityFormMode } from '../form/city.form.component';

@Component({
  selector: 'bt-city-list',
  templateUrl: 'city.list.component.html',
  styleUrls: ['./city.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CityListComponent implements ComponentType, OnInit {
  //#region Constructor
  constructor(private route: ActivatedRoute, public selector: SelectorService,
    private _searchService: SearchService, private modalService: NgbModal, private _cityService: CityService,
    private toasterService: ToasterService,) {
    this._cityService.load();
    this._searchService.onSearchSubmit().subscribe(value => {
      this._searchService.currentSearchKey = value.term;
      this._cityService.search(value.term);
    })
  }
  //#endregion

  //#region Interface implementation
  ngOnInit(): void {
    this.route.data
      .subscribe((data: { searchKey: string }) => {
        this._searchService.currentSearchKey = this.selector.citySearchKey;
      });
  }

  createEntity() {
    const activeModal = this.modalService.open(CityFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.originalCity = {
      name: '',
      thumbnail: '',
      adressCode: '',
      id: ''
    };
  }
  //#endregion

  //#region Protected method  
  edit(city: ICityBiz) {
    const activeModal = this.modalService.open(CityFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.originalCity = city;
    activeModal.componentInstance.title = 'Edit City';
    activeModal.componentInstance.mode = EntityFormMode.edit;
  }

  delete(city: ICityBiz) {
    const activeModal = this.modalService.open(ModalComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = `Confrim`;
    activeModal.componentInstance.modalContent = `Delete city : ${city.name} ?`;

    activeModal.result.then((result) => {
      this._cityService.deleteCity(city).subscribe((ret: Error | ICityBiz) => {
        if (ret instanceof Error)
          this.toasterService.pop('error', 'Args Title', 'Args Body');
        else
          this.toasterService.pop('success', 'Args Title', 'Args Body');
      });;
    },(cancel) => {
      //do nothing
    });
  }
  //#endregion
}
