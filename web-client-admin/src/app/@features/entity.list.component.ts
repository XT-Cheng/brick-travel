import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { IBiz } from '../@core/store/bizModel/biz.model';
import { IEntity } from '../@core/store/entity/entity.model';
import { EntityService } from '../@core/store/providers/entity.service';
import { ErrorService } from '../@core/store/providers/error.service';
import { UIService } from '../@core/store/providers/ui.service';
import { ModalComponent } from '../@ui/components/modal/modal.component';
import { SearchService } from '../@ui/providers/search.service';
import { ComponentType, EntityFormMode } from '../page.component';

export abstract class EntityListComponent<T extends IEntity, U extends IBiz> implements ComponentType,
    OnInit, OnDestroy {
    //#region Private members

    private destroyed$: Subject<boolean> = new Subject();

    //#endregion

    //#region Constructor

    constructor(protected _route: ActivatedRoute, protected _uiService: UIService<T, U>,
        protected _errorService: ErrorService,
        protected _searchService: SearchService, protected _modalService: NgbModal, protected _service: EntityService<T, U>,
        protected _toasterService: ToasterService) {
        this._service.fetch();
        this._searchService.onSearchSubmit().pipe(takeUntil(this.destroyed$))
            .subscribe(value => {
                this._searchService.currentSearchKey = value.term;
                this._uiService.search(value.term);
            });
    }

    //#endregion

    //#region Protected property

    protected abstract get entityType(): string;
    protected abstract get componentType(): any;
    protected abstract get newEntity(): U;

    //#endregion

    //#region Interface implementation
    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    ngOnInit(): void {
        this._route.data.pipe(takeUntil(this.destroyed$))
            .subscribe((data: { searchKey: string }) => {
                this._searchService.currentSearchKey = this._uiService.searchKey;
            });
    }

    editEntity(entity: U, name: string) {
        const activeModal = this._modalService.open(this.componentType, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
        activeModal.componentInstance.mode = EntityFormMode.edit;
        activeModal.componentInstance.originalEntity = entity;
        activeModal.componentInstance.title = `Edit ${this.entityType} ${name}`;
        activeModal.componentInstance.mode = EntityFormMode.edit;
    }

    deleteEntity(entity: U, name: string) {
        const activeModal = this._modalService.open(ModalComponent, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
        activeModal.componentInstance.modalHeader = `Confrim`;
        activeModal.componentInstance.modalContent = `Delete ${name}, are you sure?`;

        activeModal.result.then((result) => {
            const actionId = this._service.remove(entity);
            this._errorService.getActionError$(actionId).subscribe((error) => {
                this._toasterService.pop('error', 'Error', `Can't delete city, pls try later`);
            });
        }, (cancel) => {
            // do nothing
        });
    }

    createEntity() {
        const activeModal = this._modalService.open(this.componentType, { backdrop: 'static', size: 'lg', container: 'nb-layout' });
        activeModal.componentInstance.mode = EntityFormMode.create;
        activeModal.componentInstance.originalEntity = this.newEntity;
        activeModal.componentInstance.title = `Create ${this.entityType}`;
    }

    //#endregion

    //#region Public methods

    //#endregion

    //#region Protected methods


    //#endregion

}
