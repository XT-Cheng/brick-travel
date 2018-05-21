import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';

import { FileItem } from '../../../../@core/fileUpload/providers/file-item';
import { FileUploader } from '../../../../@core/fileUpload/providers/file-uploader';
import { ICityBiz } from '../../../../@core/store/bizModel/model/city.biz.model';
import { ICity } from '../../../../@core/store/entity/model/city.model';
import { CityService } from '../../../../@core/store/providers/city.service';
import { ErrorService } from '../../../../@core/store/providers/error.service';
import { WEBAPI_HOST } from '../../../../@core/utils/constants';
import { EntityFormComponent } from '../../../entity.form.component';

@Component({
  selector: 'bt-city-form',
  templateUrl: 'city.form.component.html',
  styleUrls: ['./city.form.component.scss']
})
export class CityFormComponent extends EntityFormComponent<ICity, ICityBiz> {
  //#region Private member

  //#endregion

  //#region Public member

  hasBaseDropZoneOver = false;
  thumbnailUploader: FileUploader = new FileUploader({ url: `${WEBAPI_HOST}/fileUpload` });

  //#endregion

  //#region Public property

  //#endregion

  //#region Constructor

  constructor(protected _cityService: CityService, protected _errorService: ErrorService,
    protected _toasterService: ToasterService,
    protected _activeModal: NgbActiveModal) {
    super(_cityService, _errorService, _toasterService, _activeModal);

    this.thumbnailUploader.clearQueue();
    this.thumbnailUploader.setOptions({ allowedMimeType: ['image/png'] });

    this.addFile('thumbnail', this.thumbnailUploader);
  }

  //#endregion

  //#region Public method

  hasFile(): boolean {
    return this.newEntity.thumbnail !== '';
  }

  isSubmitDisAllowed(form): boolean {
    return !this.isChanged() || !form.valid || (this.thumbnailUploader.queue.length === 0 && this.newEntity.thumbnail === '');
  }

  fileOverBase(e: boolean): void {
    this.hasBaseDropZoneOver = e;
  }

  fileDropped(fileItems: FileItem[]): void {
    const reader = new FileReader();

    reader.onloadend = (e: any) => {
      this.newEntity.thumbnail = e.target.result;
    };

    reader.readAsDataURL(fileItems[0]._file);
  }

  createOrUpdate() {
    this.action().then((ret) => {
      this._toasterService.pop('success', 'Success', `City ${this.newEntity.name} created`);
      this.close();
    }, (err) => {
      this._toasterService.pop('error', 'Error', `Can't create city, pls try later`);
    });
  }
  //#endregion

  //#region Private method

  private isChanged(): boolean {
    return !(this.newEntity.name === this.originalEntity.name &&
      this.newEntity.addressCode === this.originalEntity.addressCode &&
      this.newEntity.thumbnail === this.originalEntity.thumbnail);
  }
}
