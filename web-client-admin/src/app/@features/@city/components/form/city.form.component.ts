import { Component, Inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { ObjectID } from 'bson';
import { filter } from 'rxjs/operators';

import { FILE_UPLOADER } from '../../../../@core/fileUpload/fileUpload.module';
import { FileItem } from '../../../../@core/fileUpload/providers/file-item';
import { FileUploader } from '../../../../@core/fileUpload/providers/file-uploader';
import { ICityBiz } from '../../../../@core/store/bizModel/model/city.biz.model';
import { CityService } from '../../../../@core/store/providers/city.service';
import { ErrorService } from '../../../../@core/store/providers/error.service';
import { EntityFormMode } from '../../../../page.component';

@Component({
  selector: 'bt-city-form',
  templateUrl: 'city.form.component.html',
  styleUrls: ['./city.form.component.scss']
})
export class CityFormComponent {
  //#region Private member

  private _newCity: ICityBiz;
  private _originalCity: ICityBiz;

  //#endregion

  //#region Public member

  hasBaseDropZoneOver = false;

  //#endregion

  //#region Public property
  @Input()
  mode: EntityFormMode = EntityFormMode.create;

  @Input()
  set originalCity(city: ICityBiz) {
    if (city.id === '') {
      city.id = new ObjectID().toHexString();
    }
    this._originalCity = city;
    this._newCity = Object.assign({}, city);
  }
  get newCity(): ICityBiz {
    return this._newCity;
  }

  @Input()
  title = 'Create City';

  //#endregion

  //#region Constructor

  constructor(private _cityService: CityService, private _errorService: ErrorService,
    @Inject(FILE_UPLOADER) public uploader: FileUploader, private toasterService: ToasterService,
    private activeModal: NgbActiveModal) {
    this.uploader.clearQueue();
    this.uploader.setOptions({ allowedMimeType: ['image/png'] });

    this._cityService.all$.pipe(
      filter((cities) => !!(cities.find((city) => city.id === this._newCity.id)))
    ).subscribe(() => {
      this.toasterService.pop('success', 'Success', `City ${this._newCity.name} created`);
      this.activeModal.close();
    });

    this._errorService.lastError$.pipe(
      filter((error) => !!(error))
    ).subscribe(() => {
      this.toasterService.pop('error', 'Error', `Can't create city, pls try later`);
      this.activeModal.close();
    });
  }

  //#endregion

  //#region Public method

  hasFile(): boolean {
    return this._newCity.thumbnail !== '';
  }

  isSubmitDisAllowed(form): boolean {
    return !this.isChanged() || !form.valid || (this.uploader.queue.length === 0 && this._newCity.thumbnail === '');
  }

  fileOverBase(e: boolean): void {
    this.hasBaseDropZoneOver = e;
  }

  fileDropped(fileItems: FileItem[]): void {
    const reader = new FileReader();

    reader.onloadend = (e: any) => {
      this._newCity.thumbnail = e.target.result;
    };

    reader.readAsDataURL(fileItems[0]._file);
  }

  action() {
    if (this.mode === EntityFormMode.create) {
      this._cityService.add(this._newCity);
    } else {
      this._cityService.change(this._newCity);
    }
  }

  close() {
    this.activeModal.close();
  }

  //#endregion

  //#region Private method

  private isChanged(): boolean {
    return !(this._newCity.name === this._originalCity.name &&
      this._newCity.addressCode === this._originalCity.addressCode &&
      this._newCity.thumbnail === this._originalCity.thumbnail);
  }
}
