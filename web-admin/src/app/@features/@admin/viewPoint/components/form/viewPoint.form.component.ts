import { Component, Inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { ObjectID } from 'bson';

import { FILE_UPLOADER } from '../../../../../@core/fileUpload/fileUpload.module';
import { FileItem } from '../../../../../@core/fileUpload/providers/file-item';
import { FileUploader } from '../../../../../@core/fileUpload/providers/file-uploader';
import { ICityBiz } from '../../../../../@core/store/bizModel/city.biz.model';
import { CityService } from '../../../../../@core/store/providers/city.service';
import { IViewPointBiz } from '../../../../../@core/store/bizModel/viewPoint.biz.model';
import { ViewPointService } from '../../../../../@core/store/providers/viewPoint.service';
import { EntityFormMode } from '../../../components/admin.component';
import { NbMenuService, NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'bt-vp-form',
  templateUrl: 'viewPoint.form.component.html',
  styleUrls: ['./viewPoint.form.component.scss']
})
export class ViewPointFormComponent {
  //#region Private member

  private _newViewPoint: IViewPointBiz;
  private _originalViewPoint: IViewPointBiz;

  //#endregion

  //#region Public member
  items = [{
    title: 'Delete'
  }];

  hasBaseDropZoneOver: boolean = false;

  //#endregion

  //#region Public property
  @Input()
  mode: EntityFormMode = EntityFormMode.create;

  @Input()
  set originalViewPoint(viewPoint: IViewPointBiz) {
    if (viewPoint.id == '') {
      viewPoint.id = new ObjectID().toHexString();
    }
    this._originalViewPoint = viewPoint;
    this._newViewPoint = Object.assign({}, viewPoint);
  }
  get newViewPoint(): IViewPointBiz {
    return this._newViewPoint;
  }

  @Input()
  title: string = 'Create View Point';

  //#endregion

  //#region Constructor

  constructor(private _viewPointService: ViewPointService,
    @Inject(FILE_UPLOADER) public uploader: FileUploader, private toasterService: ToasterService,private menuService : NbMenuService,
    private activeModal: NgbActiveModal) {
    this.uploader.clearQueue();
    this.uploader.setOptions({ allowedMimeType: ['image/png'] });

    this.menuService.onItemClick().subscribe(menuBag => {
      console.log(menuBag.item);
    })
  }

  //#endregion

  //#region Public method  
  getMenuItem(img : string) : NbMenuItem[] {
    return [{
      title: 'Delete',
      data: img
    }]
  }

  hasFile(): boolean {
    return this._newViewPoint.images.length > 0;
  }

  isSubmitDisAllowed(form): boolean {
    return !this.isChanged() || !form.valid || (this.uploader.queue.length == 0 && this._newViewPoint.images.length >0);
  }

  fileOverBase(e: boolean): void {
    this.hasBaseDropZoneOver = e;
  }

  fileDropped(fileItems: FileItem[]): void {
    let reader = new FileReader();

    reader.onloadend = (e: any) => {
      this._newViewPoint.images.push(e.target.result);
    }

    reader.readAsDataURL(fileItems[0]._file)
  }

  action() {
    // if (this.mode == EntityFormMode.create) {
    //   this._cityService.addCity(this._newCity)
    //     .subscribe((ret: Error | ICityBiz) => {
    //       if (ret instanceof Error)
    //         this.toasterService.pop('error', 'Error', `Can't create city, pls try later`);
    //       else
    //         this.toasterService.pop('success', 'Success', `City ${this._newCity.name} created`);
    //       this.activeModal.close()
    //     });
    // }
    // else {
    //   this._cityService.updateCity(this._newCity)
    //     .subscribe((ret: Error | ICityBiz) => {
    //       if (ret instanceof Error)
    //         this.toasterService.pop('error', 'Error', `Can't edit city, pls try later`);
    //       else
    //         this.toasterService.pop('success', 'Success', `City ${this._newCity.name} edited`);
    //       this.activeModal.close()
    //     })
    // }
  }

  close() {
    this.activeModal.close();
  }

  //#endregion

  //#region Private method  

  private isChanged(): boolean {
    return;
    // return !(this._newCity.name == this._originalCity.name &&
    //   this._newCity.adressCode == this._originalCity.adressCode &&
    //   this._newCity.thumbnail == this._originalCity.thumbnail)
  }
}
