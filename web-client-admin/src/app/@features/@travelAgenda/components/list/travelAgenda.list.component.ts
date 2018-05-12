import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { ITravelAgendaBiz } from '../../../../@core/store/bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../../../../@core/store/bizModel/model/viewPoint.biz.model';
import { TravelAgendaService } from '../../../../@core/store/providers/travelAgenda.service';
import { TravelAgendaUIService } from '../../../../@core/store/providers/travelAgenda.ui.service';
import { ViewPointService } from '../../../../@core/store/providers/viewPoint.service';
import { ModalComponent } from '../../../../@ui/components/modal/modal.component';
import { SearchService } from '../../../../@ui/providers/search.service';
import { ComponentType } from '../../../../page.component';

@Component({
  selector: 'bt-ta-list',
  templateUrl: 'travelAgenda.list.component.html',
  styleUrls: ['./travelAgenda.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelAgendaListComponent implements ComponentType, OnInit, OnDestroy {
  //#region Private members

  private _travelAgendas$: Observable<ITravelAgendaBiz[]>;

  //#endregion

  //#region Private members

  private destroyed$: Subject<boolean> = new Subject();

  //#endregion

  //#region Constructor
  constructor(private _route: ActivatedRoute,
    private _searchService: SearchService, private _modalService: NgbModal, private _viewPointService: ViewPointService,
    private _travelAgendaService: TravelAgendaService, private _travelAgendaUIService: TravelAgendaUIService,
    private _toasterService: ToasterService) {
    this._travelAgendas$ = this._travelAgendaService.all$;
    this._travelAgendaService.fetch();
    this._searchService.onSearchSubmit().pipe(takeUntil(this.destroyed$)).subscribe(value => {
      this._searchService.currentSearchKey = value.term;
      this._travelAgendaUIService.search(value.term);
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
        this._searchService.currentSearchKey = this._travelAgendaUIService.searchKey;
      });
  }

  createEntity() {
    // const activeModal = this.modalService.open(ViewPointFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    // activeModal.componentInstance.originalViewPoint = {
    //   id: '',
    //   name: '',
    //   city: null,
    //   description: '',
    //   tips: '',
    //   timeNeeded: '',
    //   thumbnail: '',
    //   address: '',
    //   latitude: null,
    //   longtitude: null,
    //   category: null,
    //   rank: null,
    //   countOfComments: 0,
    //   images: [],
    //   tags: [],
    //   comments: []
    // };
  }
  //#endregion

  //#region Protected method
  edit(viewPoint: IViewPointBiz) {
    // const activeModal = this.modalService.open(ViewPointFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    // activeModal.componentInstance.originalViewPoint = viewPoint;
    // activeModal.componentInstance.title = 'Edit View Point';
    // activeModal.componentInstance.mode = EntityFormMode.edit;
  }

  delete(travelAgenda: ITravelAgendaBiz) {
    const activeModal = this._modalService.open(ModalComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = `Confrim`;
    activeModal.componentInstance.modalContent = `Delete view point : ${travelAgenda.name} ?`;

    activeModal.result.then((result) => {
      this._travelAgendaService.remove(travelAgenda);
    }, (cancel) => {
      // do nothing
    });
  }
  //#endregion
}
