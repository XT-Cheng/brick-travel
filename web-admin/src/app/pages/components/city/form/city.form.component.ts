import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Renderer2, ViewChild, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { SelectorService } from '../../../../store/providers/selector.service';
import { CityService } from '../../../../store/providers/city.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICityBiz } from '../../../../store/bizModel/city.biz.model';
import { ObjectID } from 'bson';
import { WEBAPI_HOST } from '../../../../store/utils/constants';
import { FILE_UPLOADER } from '../../../../@core/core.module';
import { FileUploader } from '../../../providers/file-uploader';
import { FileItem } from '../../../providers/file-item';

export enum EntityFormMode {
  create,
  edit
}

@Component({
  selector: 'bricktravel-city-form',
  templateUrl: 'city.form.component.html',
  styleUrls: ['./city.form.component.scss']
})
export class CityFormComponent {
  submitted: boolean = false;
  hasBaseDropZoneOver: boolean = false;

  constructor(private _cityService: CityService,
    @Inject(FILE_UPLOADER) protected uploader: FileUploader,
    private activeModal: NgbActiveModal) {
    this.uploader.clearQueue();
    this.uploader.setOptions({ allowedMimeType: ['image/png']});
    // this.uploader.onAfterAddingFile = f => {
    //   if (this.uploader.queue.length > 1) {
    //     this.uploader.removeFromQueue(this.uploader.queue[0]);
    //   }
    // };
  }

  @Input()
  mode: EntityFormMode = EntityFormMode.create;

  @Input()
  city: ICityBiz;

  @Input()
  title: string = 'Create City';

  hasFile(): boolean {
    return this.city.thumbnail != '';
  }

  isSubmitDisAllowed(form): boolean {
    return this.submitted || !form.valid || (this.uploader.queue.length == 0 && this.city.thumbnail == '');
  }

  create() {
    this.submitted = true;
    if (this.mode == EntityFormMode.create) {
      // this.uploader.onBuildItemForm = (item, form) => {
      //   form.append('city',JSON.stringify({
      //     id: new ObjectID().toHexString(),
      //     name: this.city.name,
      //     thumbnail: 'assets/img/IMG_4202.jpg',
      //     adressCode: 'address'
      //   }));
      // };

      // this.uploader.queue.forEach((item)=> {
      //   item.upload();
      // })

      this._cityService.addCity({
        id: new ObjectID().toHexString(),
        name: this.city.name,
        thumbnail: 'assets/img/IMG_4202.jpg',
        adressCode: 'address'
      }).subscribe((city) => {
        this.activeModal.close()
      },
        (err) => {
          this.activeModal.close()
        });
    }
    else {
      this._cityService.updateCity(this.city).subscribe((city) => {
        this.activeModal.close()
      },
        (err) => {
          this.activeModal.close()
        });;
    }
  }

  close() {
    this.activeModal.close();
  }

  fileOverBase(e: boolean): void {
      this.hasBaseDropZoneOver = e;
  }

  fileDropped(fileItems: FileItem[]): void {
    let reader = new FileReader();

    reader.onloadend = (e: any) => {
      this.city.thumbnail = e.target.result;
    }

    reader.readAsDataURL(fileItems[0]._file)
  }
}
