import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { IViewPointBiz } from '../../../../@core/store/bizModel/model/viewPoint.biz.model';
import { IViewPoint } from '../../../../@core/store/entity/model/viewPoint.model';
import { SelectorService } from '../../../../@core/store/providers/selector.service';
import { ViewPointService } from '../../../../@core/store/providers/viewPoint.service';
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
  constructor(private route: ActivatedRoute, public selector: SelectorService,
    private _searchService: SearchService, private modalService: NgbModal, private _viewPointService: ViewPointService,
    private toasterService: ToasterService) {
    this.viewPoints$ = this.selector.filterAndSearchedViewPoints$.pipe(
      combineLatest(this.cityId$), map(([vps, cityId]) => {
        const ret = vps.filter((vp) => {
          if (cityId === '') { return true; }

          return vp.city.id === cityId;
        });
        return ret;
      })
    );
    this._viewPointService.load();
    this._searchService.onSearchSubmit().pipe(takeUntil(this.destroyed$)).subscribe(value => {
      this._searchService.currentSearchKey = value.term;
      this._viewPointService.search(value.term);
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
      .subscribe((data: { searchKey: string, city: string }) => {
        this.cityId$.next(data.city);
        this._searchService.currentSearchKey = this.selector.viewPointSearchKey;
      });
  }

  createEntity() {
    const activeModal = this.modalService.open(ViewPointFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
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
    const activeModal = this.modalService.open(ViewPointFormComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.originalViewPoint = viewPoint;
    activeModal.componentInstance.title = 'Edit View Point';
    activeModal.componentInstance.mode = EntityFormMode.edit;
  }

  delete(viewPoint: IViewPointBiz) {
    const activeModal = this.modalService.open(ModalComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = `Confrim`;
    activeModal.componentInstance.modalContent = `Delete view point : ${viewPoint.name} ?`;

    activeModal.result.then((result) => {
      this._viewPointService.deleteViewPoint(viewPoint).subscribe((ret: Error | IViewPoint) => {
        if (ret instanceof Error) {
          this.toasterService.pop('error', 'Error', `Can't delete city, pls try later`);
        } else {
          this.toasterService.pop('success', 'Success', `View point ${viewPoint.name} deleted`);
        }
      });
    }, (cancel) => {
      // do nothing
    });
  }
  //#endregion
}
