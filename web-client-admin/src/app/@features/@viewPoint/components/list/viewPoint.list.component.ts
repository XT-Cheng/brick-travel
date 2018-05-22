import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest, map, takeUntil } from 'rxjs/operators';

import { IViewPointBiz, newViewPoint } from '../../../../@core/store/bizModel/model/viewPoint.biz.model';
import { IViewPoint } from '../../../../@core/store/entity/model/viewPoint.model';
import { ErrorService } from '../../../../@core/store/providers/error.service';
import { ViewPointService } from '../../../../@core/store/providers/viewPoint.service';
import { ViewPointUIService } from '../../../../@core/store/providers/viewPoint.ui.service';
import { SearchService } from '../../../../@ui/providers/search.service';
import { EntityListComponent } from '../../../entity.list.component';
import { ViewPointFormComponent } from '../form/viewPoint.form.component';

@Component({
  selector: 'bt-vp-list',
  templateUrl: 'viewPoint.list.component.html',
  styleUrls: ['./viewPoint.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewPointListComponent extends EntityListComponent<IViewPoint, IViewPointBiz> implements OnInit {
  //#region Private members

  private cityId$: BehaviorSubject<string> = new BehaviorSubject('');

  //#endregion

  //#region Public members

  viewPointsByCity$: Observable<IViewPointBiz[]>;

  //#endregion

  //#region Constructor
  constructor(protected _route: ActivatedRoute, public _viewPointUIService: ViewPointUIService,
    protected _errorService: ErrorService,
    protected _searchService: SearchService, protected _modalService: NgbModal, public _viewPointService: ViewPointService,
    protected _toasterService: ToasterService) {
    super(_route, _viewPointUIService, _errorService, _searchService, _modalService, _viewPointService, _toasterService);

    this.viewPointsByCity$ = this._viewPointService.filteredAndSearched$.pipe(
      combineLatest(this.cityId$),
      map(([vps, cityId]) => {
        const ret = vps.filter((vp) => {
          if (cityId === '') { return true; }

          return vp.city.id === cityId;
        });
        return ret;
      })
    );
  }

  //#endregion

  //#region Interface implementation
  ngOnInit(): void {
    super.ngOnInit();

    this._route.paramMap.pipe(takeUntil(this.destroyed$))
      .subscribe((paramMap) => {
        this.cityId$.next(paramMap.get('city'));
      });
  }

  protected get componentType(): any {
    return ViewPointFormComponent;
  }

  protected get newEntity(): IViewPointBiz {
    return newViewPoint();
  }

  protected get entityDescription(): string {
    return 'ViewPoint';
  }

  //#endregion

  //#region Public method
  edit(viewPoint: IViewPointBiz) {
    this.editEntity(viewPoint, viewPoint.name);
  }

  delete(viewPoint: IViewPointBiz) {
    this.deleteEntity(viewPoint, viewPoint.name).then((ret) => {
      if (ret) {
        this._toasterService.pop('success', 'Success', `ViewPoint ${viewPoint.name} deleted`);
      }
    }, (err) => {
      this._toasterService.pop('error', 'Error', `Can't delete view point, pls try later`);
    });
  }

  //#endregion
}
