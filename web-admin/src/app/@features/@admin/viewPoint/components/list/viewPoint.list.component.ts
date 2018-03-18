import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';

import { IViewPointBiz } from '../../../../../@core/store/bizModel/viewPoint.biz.model';
import { SelectorService } from '../../../../../@core/store/providers/selector.service';
import { ViewPointService } from '../../../../../@core/store/providers/viewPoint.service';
import { SearchService } from '../../../../../@ui/providers/search.service';
import { ComponentType, EntityFormMode } from '../../../components/admin.component';
import { ViewPointFormComponent } from '../form/viewPoint.form.component';

@Component({
  selector: 'bt-vp-list',
  templateUrl: 'viewPoint.list.component.html',
  styleUrls: ['./viewPoint.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewPointListComponent implements ComponentType, OnInit {
  //#region Constructor
  constructor(private route: ActivatedRoute, public selector: SelectorService,
    private _searchService: SearchService, private modalService: NgbModal, private _viewPointService: ViewPointService,
    private toasterService: ToasterService,) {
    this._viewPointService.load();
    this._searchService.onSearchSubmit().subscribe(value => {
      this._searchService.currentSearchKey = value.term;
      this._viewPointService.search(value.term);
    })
  }
  //#endregion

  //#region Interface implementation
  ngOnInit(): void {
    this.route.data
      .subscribe((data: { searchKey: string }) => {
        this._searchService.currentSearchKey = this.selector.viewPointSearchKey;
      });
  }

  createEntity() {
    // const activeModal = this.modalService.open(CityFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    // activeModal.componentInstance.originalCity = {
    //   name: '',
    //   thumbnail: '',
    //   adressCode: '',
    //   id: ''
    // };
  }
  //#endregion

  //#region Protected method  
  edit(viewPoint: IViewPointBiz) {
    const activeModal = this.modalService.open(ViewPointFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.originalViewPoint = viewPoint;
    activeModal.componentInstance.title = 'Edit View Point';
    activeModal.componentInstance.mode = EntityFormMode.edit;
  }

  delete(viewPoint: IViewPointBiz) {
    // const activeModal = this.modalService.open(ModalComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    // activeModal.componentInstance.modalHeader = `Confrim`;
    // activeModal.componentInstance.modalContent = `Delete city : ${city.name} ?`;

    // activeModal.result.then((result) => {
    //   this._viewPointService.deleteCity(city).subscribe((ret: Error | ICityBiz) => {
    //     if (ret instanceof Error)
    //       this.toasterService.pop('error', 'Error', `Can't delete city, pls try later`);
    //     else
    //       this.toasterService.pop('success', 'Success', `City ${city.name} deleted`);
    //   });;
    // },(cancel) => {
    //   //do nothing
    // });
  }
  //#endregion
}
