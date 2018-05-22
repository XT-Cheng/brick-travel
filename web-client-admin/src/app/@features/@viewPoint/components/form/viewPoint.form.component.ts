import { AfterViewInit, Component, ElementRef, Input, ViewChild, ViewChildren } from '@angular/core';
import { NbContextMenuDirective, NbMenuItem, NbMenuService } from '@nebular/theme';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { ObjectID } from 'bson';

import { FileItem } from '../../../../@core/fileUpload/providers/file-item';
import { FileUploader } from '../../../../@core/fileUpload/providers/file-uploader';
import { IViewPointBiz } from '../../../../@core/store/bizModel/model/viewPoint.biz.model';
import { CityService } from '../../../../@core/store/providers/city.service';
import { ViewPointService } from '../../../../@core/store/providers/viewPoint.service';
import { ViewPointUIService } from '../../../../@core/store/providers/viewPoint.ui.service';
import { ViewPointCategoryService } from '../../../../@core/store/providers/viewPointCategory.service';
import { WEBAPI_HOST } from '../../../../@core/utils/constants';
import { EntityFormMode } from '../../../../page.component';
import { MapModalComponent } from '../mapModal.component';
import { EntityFormComponent } from '../../../entity.form.component';
import { IViewPoint } from '../../../../@core/store/entity/model/viewPoint.model';
import { ErrorService } from '../../../../@core/store/providers/error.service';

@Component({
  selector: 'bt-vp-form',
  templateUrl: 'viewPoint.form.component.html',
  styleUrls: ['./viewPoint.form.component.scss']
})
export class ViewPointFormComponent extends EntityFormComponent<IViewPoint, IViewPointBiz> {
   //#region Private member
   private _imagesFiles: Map<string, FileItem> = new Map<string, FileItem>();
  //#endregion

  //#region Public member
  items = [{
    title: 'Delete'
  }];

  hasImagesDropZoneOver = false;
  hasThumbnailDropZoneOver = false;

  imagesUploader: FileUploader = new FileUploader({ url: `${WEBAPI_HOST}/fileUpload` });
  thumbnailUploader: FileUploader = new FileUploader({ url: `${WEBAPI_HOST}/fileUpload` });

  //#endregion

  //#region Public property
  selectedCity: any = null;

  @ViewChild('name', { read: ElementRef }) nameInput: ElementRef;

  @ViewChildren(NbContextMenuDirective) contextMenus;

  //#endregion

  //#region Constructor

  constructor(public _viewPointService: ViewPointService, private _modalService: NgbModal, private _element: ElementRef,
    public _viewPointUIService: ViewPointUIService, public _viewPointCategoryService: ViewPointCategoryService,
    public _cityService: CityService, protected _errorService: ErrorService,
    protected _toasterService: ToasterService, private _menuService: NbMenuService,
    protected _activeModal: NgbActiveModal) {
    super(_viewPointService, _errorService, _toasterService, _activeModal);

    this.imagesUploader.clearQueue();
    this.imagesUploader.setOptions({ allowedMimeType: ['image/png'] });

    this.thumbnailUploader.clearQueue();
    this.thumbnailUploader.setOptions({ allowedMimeType: ['image/png'] });

    this.addFile('images', this.imagesUploader);
    this.addFile('thumbnail', this.thumbnailUploader);

    this._menuService.onItemClick().subscribe(menuBag => {
      if (this.newEntity == null) { return; }

      const { file, source } = menuBag.item.data;

      if (file) {
        this.imagesUploader.removeFromQueue(file);
      }
      const index = this.newEntity.images.findIndex((img) => {
        return img === source;
      });
      if (index !== -1) {
        this.newEntity.images.splice(index, 1);
      }

      this.contextMenus.forEach(item => {
        item.hide();
      });
    });
  }

  //#endregion

  //#region Public method
  compareCityFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  getMenuItem(img: string): NbMenuItem[] {
    const fileItem = this._imagesFiles.get(img);

    return [{
      title: 'Delete',
      data: { file: fileItem, source: img }
    }];
  }

  getClientHeight() {
    return this._element.nativeElement.clientHeight;
  }

  hasCity(): boolean {
    return !!this.newEntity.city;
  }

  hasPosition(): boolean {
    return (!!this.newEntity.latitude && !!this.newEntity.longtitude);
  }

  hasImageFiles(): boolean {
    return this.newEntity.images.length > 0;
  }

  hasThumbnailFile(): boolean {
    return !!this.newEntity.thumbnail;
  }

  isSubmitDisAllowed(form): boolean {
    return !this.isChanged() || !form.valid || (this.newEntity.images.length === 0);
  }

  imageFileOver(e: boolean): void {
    this.hasImagesDropZoneOver = e;
  }

  thumbnailFileOver(e: boolean): void {
    this.hasThumbnailDropZoneOver = e;
  }

  imageFileDropped(fileItems: FileItem[]): void {
    const reader = new FileReader();

    reader.onloadend = (e: any) => {
      this.newEntity.images.push(e.target.result);
      this._imagesFiles.set(e.target.result, fileItems[0]);
    };

    reader.readAsDataURL(fileItems[0]._file);
  }

  thumbnailFileDropped(fileItems: FileItem[]): void {
    const reader = new FileReader();

    reader.onloadend = (e: any) => {
      this.newEntity.thumbnail = e.target.result;
    };

    reader.readAsDataURL(fileItems[0]._file);
  }

  createOrUpdate() {
    let successMsg, failMsg;

    if (this.mode === EntityFormMode.create) {
      successMsg = `View Point ${this.newEntity.name} created`;
      failMsg = `Can't create view point, pls try later`;
    } else {
      successMsg = `View Point ${this.newEntity.name} updated`;
      failMsg = `Can't change view point, pls try later`;
    }

    this.action().then((ret) => {
      this._toasterService.pop('success', 'Success', successMsg);
      this.close();
    }, (err) => {
      this._toasterService.pop('error', 'Error', failMsg);
    });
  }

  openMap() {
    const activeModal = this._modalService.open(MapModalComponent, { backdrop: false, size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.minHeight = 500;
    activeModal.componentInstance.city = this.newEntity.city;

    this._element.nativeElement.style.display = 'none';

    if (this.newEntity.latitude) {
      activeModal.componentInstance.pointChoosed = new AMap.LngLat(this.newEntity.longtitude, this.newEntity.latitude);
    }
    activeModal.result.then((pos: AMap.LngLat) => {
      this.newEntity.latitude = pos.getLat();
      this.newEntity.longtitude = pos.getLng();
      this._element.nativeElement.style.display = 'block';
      this._element.nativeElement.ownerDocument.body.classList.add('modal-open');
    }, (cancel) => {
      this._element.nativeElement.style.display = 'block';
      this._element.nativeElement.ownerDocument.body.classList.add('modal-open');
    });
  }

  //#endregion

  //#region Private method

  private isChanged(): boolean {
    if (this.mode === EntityFormMode.create) { return true; }

    const changed = !(this.newEntity.name === this.originalEntity.name &&
      this.newEntity.city.id === this.originalEntity.city.id &&
      this.newEntity.category.id === this.originalEntity.category.id &&
      this.newEntity.address === this.originalEntity.address &&
      this.newEntity.description === this.originalEntity.description &&
      this.newEntity.latitude === this.originalEntity.latitude &&
      this.newEntity.longtitude === this.originalEntity.longtitude &&
      this.newEntity.rank === this.originalEntity.rank &&
      this.newEntity.tags === this.originalEntity.tags &&
      this.newEntity.timeNeeded === this.originalEntity.timeNeeded &&
      this.newEntity.tips === this.originalEntity.tips &&
      this.newEntity.thumbnail === this.originalEntity.thumbnail &&
      this.newEntity.images.length === this.originalEntity.images.length);

    if (changed) { return changed; }

    for (let i = 0; i < this.newEntity.images.length; i++) {
      if (this.newEntity.images[i] !== this.originalEntity.images[i]) {
        return true;
      }
    }

    return false;
  }
}
