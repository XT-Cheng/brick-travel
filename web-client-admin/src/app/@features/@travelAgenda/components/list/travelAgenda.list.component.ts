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
import { EntityListComponent } from '../../../entity.list.component';
import { ITravelAgenda } from '../../../../@core/store/entity/model/travelAgenda.model';
import { ErrorService } from '../../../../@core/store/providers/error.service';

@Component({
  selector: 'bt-ta-list',
  templateUrl: 'travelAgenda.list.component.html',
  styleUrls: ['./travelAgenda.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelAgendaListComponent extends EntityListComponent<ITravelAgenda, ITravelAgendaBiz> {
  //#region Private members

  //#endregion

  //#region Private members

  //#endregion

  //#region Constructor
  constructor(protected _route: ActivatedRoute,
    protected _searchService: SearchService, protected _modalService: NgbModal, protected _viewPointService: ViewPointService,
    protected _errorService: ErrorService,
    public _travelAgendaService: TravelAgendaService, protected _travelAgendaUIService: TravelAgendaUIService,
    protected _toasterService: ToasterService) {
      super(_route, _travelAgendaUIService, _errorService, _searchService, _modalService, _travelAgendaService, _toasterService);
  }

  //#endregion

  //#region Interface implementation

  protected get componentType(): any {
    throw new Error('not implemented');
  }

  protected get newEntity(): ITravelAgendaBiz {
    throw new Error('not implemented');
  }

  protected get entityDescription(): string {
    return 'Travel Agenda';
  }

  //#endregion

   //#region Public method
   edit(travelAgenda: ITravelAgendaBiz) {
    this.editEntity(travelAgenda, travelAgenda.name);
  }

  delete(travelAgenda: ITravelAgendaBiz) {
    this.deleteEntity(travelAgenda, travelAgenda.name).then((ret) => {
      if (ret) {
        this._toasterService.pop('success', 'Success', `Travel Agenda ${travelAgenda.name} deleted`);
      }
    }, (err) => {
      this._toasterService.pop('error', 'Error', `Can't delete Travel Agenda, pls try later`);
    });
  }

  //#endregion
}
