import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { IViewPointBiz } from '../../../../@core/store/bizModel/model/viewPoint.biz.model';
import { ViewPointService } from '../../../../@core/store/providers/viewPoint.service';
import { ViewPointUIService } from '../../../../@core/store/providers/viewPoint.ui.service';
import { ModalComponent } from '../../../../@ui/components/modal/modal.component';
import { SearchService } from '../../../../@ui/providers/search.service';
import { ComponentType, EntityFormMode } from '../../../../page.component';
import { ViewPointFormComponent } from '../form/viewPoint.form.component';

@Component({
  selector: 'bt-vp-list',
  templateUrl: 'viewPoint.list.component.html',
  styleUrls: ['./viewPoint.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewPointListComponent implements ComponentType, OnInit, OnDestroy {
  //#region Private members

  viewPoints$: Observable<IViewPointBiz[]>;

  //#endregion

  //#region Private members

  private destroyed$: Subject<boolean> = new Subject();
  private cityId$: BehaviorSubject<string> = new BehaviorSubject('');

  //#endregion

  //#region Constructor
  constructor(private _route: ActivatedRoute, public _viewPointUIService: ViewPointUIService,
    private _searchService: SearchService, private _modalService: NgbModal, private _viewPointService: ViewPointService,
    private _toasterService: ToasterService) {
    this.viewPoints$ = this._viewPointUIService.filterAndSearchedViewPoints$.pipe(
      combineLatest(this.cityId$), map(([vps, cityId]) => {
        const ret = vps.filter((vp) => {
          if (cityId === '') { return true; }

          return vp.city.id === cityId;
        });
        return ret;
      })
    );
    this._viewPointService.fetch();
    this._searchService.onSearchSubmit().pipe(takeUntil(this.destroyed$)).subscribe(value => {
      this._searchService.currentSearchKey = value.term;
      this._viewPointUIService.search(value.term);
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
      .subscribe((data: { searchKey: string, city: string }) => {
        this.cityId$.next(data.city);
        this._searchService.currentSearchKey = this._viewPointUIService.searchKey;
      });
  }

  createEntity() {
    const activeModal = this._modalService.open(ViewPointFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.originalViewPoint = {
      id: '',
      name: '',
      city: null,
      description: '',
      tips: '',
      timeNeeded: '',
      thumbnail: '',
      address: '',
      latitude: null,
      longtitude: null,
      category: null,
      rank: null,
      countOfComments: 0,
      images: [],
      tags: [],
      comments: []
    };
  }
  //#endregion

  //#region Protected method
  edit(viewPoint: IViewPointBiz) {
    const activeModal = this._modalService.open(ViewPointFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.originalViewPoint = viewPoint;
    activeModal.componentInstance.title = 'Edit View Point';
    activeModal.componentInstance.mode = EntityFormMode.edit;
  }

  delete(viewPoint: IViewPointBiz) {
    const activeModal = this._modalService.open(ModalComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = `Confrim`;
    activeModal.componentInstance.modalContent = `Delete view point : ${viewPoint.name} ?`;

    activeModal.result.then((result) => {
      this._viewPointService.remove(viewPoint);
    }, (cancel) => {
      // do nothing
    });
  }
  //#endregion
}
