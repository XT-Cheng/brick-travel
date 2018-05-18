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

@Component({
  selector: 'bt-vp-form',
  templateUrl: 'viewPoint.form.component.html',
  styleUrls: ['./viewPoint.form.component.scss']
})
export class ViewPointFormComponent implements AfterViewInit {

  //#region Private member

  private _originalViewPoint: IViewPointBiz = null;
  private _imageFiles: Map<string, FileItem>;
  private _thumbnailFile: FileItem;
  //#endregion

  //#region Public member
  items = [{
    title: 'Delete'
  }];

  hasImagesDropZoneOver = false;
  hasThumbnailDropZoneOver = false;

  imagesUploader: FileUploader = new FileUploader({ url: `${WEBAPI_HOST}/fileUpload` });
  thumbnailUploader: FileUploader = new FileUploader({ url: `${WEBAPI_HOST}/fileUpload` });

  filesMap: Map<string, FileUploader> = new Map<string, FileUploader>();

  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
    this.nameInput.nativeElement.focus();
  }
  //#endregion

  //#region Public property
  newViewPoint: IViewPointBiz = null;
  selectedCity: any = null;

  @ViewChild('name', { read: ElementRef }) nameInput: ElementRef;

  @ViewChildren(NbContextMenuDirective) contextMenus;

  @Input()
  mode: EntityFormMode = EntityFormMode.create;

  @Input()
  set originalViewPoint(viewPoint: IViewPointBiz) {
    if (viewPoint.id === '') {
      viewPoint.id = new ObjectID().toHexString();
    }
    this._originalViewPoint = viewPoint;
    this.newViewPoint = JSON.parse(JSON.stringify(this._originalViewPoint));
  }

  @Input()
  title = 'Create View Point';

  //#endregion

  //#region Constructor

  constructor(private _viewPointService: ViewPointService, private _modalService: NgbModal, private _element: ElementRef,
    public _viewPointUIService: ViewPointUIService, public _viewPointCategoryService: ViewPointCategoryService,
    public _cityService: CityService,
    private _toasterService: ToasterService, private _menuService: NbMenuService,
    private _activeModal: NgbActiveModal) {
    this._imageFiles = new Map<string, FileItem>();

    this.imagesUploader.clearQueue();
    this.imagesUploader.setOptions({ allowedMimeType: ['image/png'] });

    this.thumbnailUploader.clearQueue();
    this.thumbnailUploader.setOptions({ allowedMimeType: ['image/png'] });

    this.filesMap.set('images', this.imagesUploader);
    this.filesMap.set('thumbnail', this.thumbnailUploader);

    this._menuService.onItemClick().subscribe(menuBag => {
      if (this.newViewPoint == null) { return; }

      const { file, source } = menuBag.item.data;

      if (file) {
        this.imagesUploader.removeFromQueue(file);
      }
      const index = this.newViewPoint.images.findIndex((img) => {
        return img === source;
      });
      if (index !== -1) {
        this.newViewPoint.images.splice(index, 1);
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
    const fileItem = this._imageFiles.get(img);

    return [{
      title: 'Delete',
      data: { file: fileItem, source: img }
    }];
  }

  getClientHeight() {
    return this._element.nativeElement.clientHeight;
  }

  hasCity(): boolean {
    return !!this.newViewPoint.city;
  }

  cityCheck(city) {
    console.log(city);
  }

  hasPosition(): boolean {
    return (!!this.newViewPoint.latitude && !!this.newViewPoint.longtitude);
  }

  hasImageFiles(): boolean {
    return this.newViewPoint.images.length > 0;
  }

  hasThumbnailFile(): boolean {
    return !!this.newViewPoint.thumbnail;
  }

  isSubmitDisAllowed(form): boolean {
    return !this.isChanged() || !form.valid || (this.newViewPoint.images.length === 0);
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
      this.newViewPoint.images.push(e.target.result);
      fileItems.forEach(item => {
        this._imageFiles.set(e.target.result, item);
      });
    };

    reader.readAsDataURL(fileItems[0]._file);
  }

  thumbnailFileDropped(fileItems: FileItem[]): void {
    const reader = new FileReader();

    reader.onloadend = (e: any) => {
      this.newViewPoint.thumbnail = e.target.result;
      this._thumbnailFile = fileItems[0];
    };

    reader.readAsDataURL(fileItems[0]._file);
  }

  action() {
    this.newViewPoint.images = this.newViewPoint.images.filter(img => {
      return !img.startsWith('data:');
    });

    this.newViewPoint.thumbnail = '';

    if (this.mode === EntityFormMode.create) {
      this._viewPointService.add(this.newViewPoint, this.filesMap);
      // this._viewPointService.add(this.newViewPoint, this._filesMap)
      //   .subscribe((ret: Error | IViewPoint) => {
      //     if (ret instanceof Error) {
      //       this._toasterService.pop('error', 'Error', `Can't create view point, pls try later`);
      //     } else {
      //       this._toasterService.pop('success', 'Success', `View Point ${this.newViewPoint.name} created`);
      //     }
      //     this._activeModal.close();
      //   });
    } else {
      this._viewPointService.change(this.newViewPoint, this.filesMap);
      // this._viewPointService.change(this.newViewPoint, this._filesMap)
      //   .subscribe((ret: Error | IViewPoint) => {
      //     if (ret instanceof Error) {
      //       this._toasterService.pop('error', 'Error', `Can't edit city, pls try later`);
      //     } else {
      //       this._toasterService.pop('success', 'Success', `View Point ${this.newViewPoint.name} edited`);
      //     }
      //     this._activeModal.close();
      //   });
    }
  }

  close() {
    this._activeModal.close();
  }

  openMap() {
    const activeModal = this._modalService.open(MapModalComponent, { backdrop: false, size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.minHeight = 500;
    activeModal.componentInstance.city = this.newViewPoint.city;

    this._element.nativeElement.style.display = 'none';

    if (this.newViewPoint.latitude) {
      activeModal.componentInstance.pointChoosed = new AMap.LngLat(this.newViewPoint.longtitude, this.newViewPoint.latitude);
    }
    activeModal.result.then((pos: AMap.LngLat) => {
      this.newViewPoint.latitude = pos.getLat();
      this.newViewPoint.longtitude = pos.getLng();
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

    const changed = !(this.newViewPoint.name === this._originalViewPoint.name &&
      this.newViewPoint.city.id === this._originalViewPoint.city.id &&
      this.newViewPoint.category.id === this._originalViewPoint.category.id &&
      this.newViewPoint.address === this._originalViewPoint.address &&
      this.newViewPoint.description === this._originalViewPoint.description &&
      this.newViewPoint.latitude === this._originalViewPoint.latitude &&
      this.newViewPoint.longtitude === this._originalViewPoint.longtitude &&
      this.newViewPoint.rank === this._originalViewPoint.rank &&
      this.newViewPoint.tags === this._originalViewPoint.tags &&
      this.newViewPoint.timeNeeded === this._originalViewPoint.timeNeeded &&
      this.newViewPoint.tips === this._originalViewPoint.tips &&
      this.newViewPoint.thumbnail === this._originalViewPoint.thumbnail &&
      this.newViewPoint.images.length === this._originalViewPoint.images.length);

    if (changed) { return changed; }

    for (let i = 0; i < this.newViewPoint.images.length; i++) {
      if (this.newViewPoint.images[i] !== this._originalViewPoint.images[i]) {
        return true;
      }
    }

    return false;
  }
}
