import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { ObjectID } from 'bson';

import { FileUploader } from '../@core/fileUpload/providers/file-uploader';
import { IBiz } from '../@core/store/bizModel/biz.model';
import { IEntity } from '../@core/store/entity/entity.model';
import { EntityService } from '../@core/store/providers/entity.service';
import { ErrorService } from '../@core/store/providers/error.service';
import { EntityFormMode } from '../page.component';

export abstract class EntityFormComponent<T extends IEntity, U extends IBiz> {
    //#region Private member

    private _newEntity: U;
    private _originalEntity: U;
    private _filesMap: Map<string, FileUploader> = new Map<string, FileUploader>();
    //#endregion

    //#region Public member

    //#endregion

    //#region Public property
    mode: EntityFormMode = EntityFormMode.create;
    title: string;

    set originalEntity(entity: U) {
        if (entity.id === '') {
            entity.id = new ObjectID().toHexString();
        }
        this._originalEntity = entity;
        this._newEntity = Object.assign({}, entity);
    }

    get originalEntity(): U {
        return this._originalEntity;
    }

    get newEntity(): U {
        return this._newEntity;
    }

    //#endregion

    //#region Constructor
    constructor(protected _service: EntityService<T, U>, protected _errorService: ErrorService,
        protected _toasterService: ToasterService,
        protected _activeModal: NgbActiveModal) {

        // this._cityService.all$.pipe(
        //   filter((cities) => !!(cities.find((city) => city.id === this._newCity.id)))
        // ).subscribe(() => {
        //   this.toasterService.pop('success', 'Success', `City ${this._newCity.name} created`);
        //   this.activeModal.close();
        // });

        // this._errorService.lastError$.pipe(
        //   filter((error) => !!(error))
        // ).subscribe(() => {
        //   this.toasterService.pop('error', 'Error', `Can't create city, pls try later`);
        //   this.activeModal.close();
        // });
    }

    //#endregion

    //#region Public methods
    public addFile(key: string, uploader: FileUploader) {
        this._filesMap.set(key, uploader);
    }

    public action(): void {
        if (this.mode === EntityFormMode.create) {
            this._service.add(this._newEntity, this._filesMap);
        } else {
            this._service.change(this._newEntity, this._filesMap);
        }
    }

    public close() {
        this._activeModal.close();
    }
    //#endregion
}
