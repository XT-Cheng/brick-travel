import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { IViewPointBiz, newViewPoint } from '../../../../@core/store/bizModel/model/viewPoint.biz.model';
import { ViewPointService } from '../../../../@core/store/providers/viewPoint.service';
import { ViewPointUIService } from '../../../../@core/store/providers/viewPoint.ui.service';
import { ModalComponent } from '../../../../@ui/components/modal/modal.component';
import { SearchService } from '../../../../@ui/providers/search.service';
import { ComponentType, EntityFormMode } from '../../../../page.component';
import { ViewPointFormComponent } from '../form/viewPoint.form.component';
import { IViewPoint } from '../../../../@core/store/entity/model/viewPoint.model';
import { EntityListComponent } from '../../../entity.list.component';
import { ErrorService } from '../../../../@core/store/providers/error.service';

@Component({
  selector: 'bt-vp-list',
  templateUrl: 'viewPoint.list.component.html',
  styleUrls: ['./viewPoint.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewPointListComponent extends EntityListComponent<IViewPoint, IViewPointBiz> {
  //#region Private members

  //#endregion

  //#region Constructor
  constructor(protected _route: ActivatedRoute, public _viewPointUIService: ViewPointUIService,
    protected _errorService: ErrorService,
    protected _searchService: SearchService, protected _modalService: NgbModal, public _viewPointService: ViewPointService,
    protected _toasterService: ToasterService) {
      super(_route, _viewPointUIService, _errorService, _searchService, _modalService, _viewPointService, _toasterService);
  }

  //#endregion

  //#region Interface implementation

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
