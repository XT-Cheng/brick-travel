import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { ICityBiz } from '../../../../@core/store/bizModel/model/city.biz.model';
import { CityService } from '../../../../@core/store/providers/city.service';
import { CityUIService } from '../../../../@core/store/providers/city.ui.service';
import { ModalComponent } from '../../../../@ui/components/modal/modal.component';
import { SearchService } from '../../../../@ui/providers/search.service';
import { ComponentType, EntityFormMode } from '../../../../page.component';
import { CityFormComponent } from '../form/city.form.component';

@Component({
  selector: 'bt-city-list',
  templateUrl: 'city.list.component.html',
  styleUrls: ['./city.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CityListComponent implements ComponentType, OnInit, OnDestroy {
  //#region Private members

  private destroyed$: Subject<boolean> = new Subject();

  //#endregion

  //#region Constructor
  constructor(private _route: ActivatedRoute, private _cityUIService: CityUIService,
    private _searchService: SearchService, private _modalService: NgbModal, private _cityService: CityService,
    private _toasterService: ToasterService) {
    this._cityService.fetch();
    this._searchService.onSearchSubmit().pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        this._searchService.currentSearchKey = value.term;
        this._cityUIService.search(value.term);
      });
  }
  //#endregion

  //#region Interface implementation
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this._route.data.pipe(takeUntil(this.destroyed$))
      .subscribe((data: { searchKey: string }) => {
        this._searchService.currentSearchKey = this._cityUIService.searchKey;
      });
  }

  createEntity() {
    const activeModal = this._modalService.open(CityFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
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
    const activeModal = this._modalService.open(CityFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.originalCity = city;
    activeModal.componentInstance.title = 'Edit City';
    activeModal.componentInstance.mode = EntityFormMode.edit;
  }

  delete(city: ICityBiz) {
    const activeModal = this._modalService.open(ModalComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = `Confrim`;
    activeModal.componentInstance.modalContent = `Delete city : ${city.name} ?`;

    activeModal.result.then((result) => {
      this._cityService.remove(city);
    }, (cancel) => {
      // do nothing
    });
  }
  //#endregion
}
