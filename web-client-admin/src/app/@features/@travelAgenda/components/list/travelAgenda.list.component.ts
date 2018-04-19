import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { ITravelAgendaBiz } from '../../../../@core/store/bizModel/travelAgenda.biz.model';
import { IViewPointBiz } from '../../../../@core/store/bizModel/viewPoint.biz.model';
import { ITravelAgenda } from '../../../../@core/store/entity/travelAgenda/travelAgenda.model';
import { SelectorService } from '../../../../@core/store/providers/selector.service';
import { TravelAgendaService } from '../../../../@core/store/providers/travelAgenda.service';
import { ViewPointService } from '../../../../@core/store/providers/viewPoint.service';
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

  travelAgendas$: Observable<ITravelAgendaBiz[]>;

  //#endregion

  //#region Private members

  private destroyed$: Subject<boolean> = new Subject();

  //#endregion

  //#region Constructor
  constructor(private route: ActivatedRoute, public selector: SelectorService,
    private _searchService: SearchService, private modalService: NgbModal, private _viewPointService: ViewPointService,
    private _travelAgendaService: TravelAgendaService,
    private toasterService: ToasterService) {
    this.travelAgendas$ = this.selector.travelAgendas$;
    this._travelAgendaService.load();
    this._searchService.onSearchSubmit().pipe(takeUntil(this.destroyed$)).subscribe(value => {
      this._searchService.currentSearchKey = value.term;
      this._travelAgendaService.search(value.term);
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
        this._searchService.currentSearchKey = this.selector.travelAgendaSearchKey;
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
    const activeModal = this.modalService.open(ModalComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = `Confrim`;
    activeModal.componentInstance.modalContent = `Delete view point : ${travelAgenda.name} ?`;

    activeModal.result.then((result) => {
      this._travelAgendaService.deleteTravelAgenda(travelAgenda).subscribe((ret: Error | ITravelAgenda) => {
        if (ret instanceof Error) {
          this.toasterService.pop('error', 'Error', `Can't delete city, pls try later`);
        } else {
          this.toasterService.pop('success', 'Success', `View point ${travelAgenda.name} deleted`);
        }
      });
    }, (cancel) => {
      // do nothing
    });
  }
  //#endregion
}
