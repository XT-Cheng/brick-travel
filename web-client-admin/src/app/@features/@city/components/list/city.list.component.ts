import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { ICityBiz } from '../../../../@core/store/bizModel/city.biz.model';
import { CityService } from '../../../../@core/store/providers/city.service';
import { SelectorService } from '../../../../@core/store/providers/selector.service';
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
  constructor(private route: ActivatedRoute, public selector: SelectorService,
    private _searchService: SearchService, private modalService: NgbModal, private _cityService: CityService,
    private toasterService: ToasterService) {
    this._cityService.load();
    this._searchService.onSearchSubmit().pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        this._searchService.currentSearchKey = value.term;
        this._cityService.search(value.term);
    });
  }
  //#endregion

  //#region Interface implementation
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.destroyed$))
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
        if (ret instanceof Error) {
          this.toasterService.pop('error', 'Error', `Can't delete city, pls try later`);
        } else {
          this.toasterService.pop('success', 'Success', `City ${city.name} deleted`);
        }
      });
    }, (cancel) => {
      // do nothing
    });
  }
  //#endregion
}
