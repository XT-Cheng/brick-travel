import { Component, Inject, Input, ViewChildren, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { ObjectID } from 'bson';

import { FILE_UPLOADER } from 'shared/@core/fileUpload/fileUpload.module';
import { FileItem } from 'shared/@core/fileUpload/providers/file-item';
import { FileUploader } from 'shared/@core/fileUpload/providers/file-uploader';
import { ICityBiz } from 'shared/@core/store/bizModel/city.biz.model';
import { CityService } from 'shared/@core/store/providers/city.service';
import { IViewPointBiz } from 'shared/@core/store/bizModel/viewPoint.biz.model';
import { ViewPointService } from 'shared/@core/store/providers/viewPoint.service';
import { NbMenuService, NbMenuItem, NbContextMenuDirective } from '@nebular/theme';
import { SelectorService } from 'shared/@core/store/providers/selector.service';
import { IViewPoint } from 'shared/@core/store/entity/viewPoint/viewPoint.model';
import { EntityFormMode } from '../../../../app.component';
import { AMapComponent } from '../../../../@ui/components/a-map/a-map.component';
import { MapModalComponent } from '../mapModal.component';
import { WEBAPI_HOST } from 'shared/@core/utils/constants';

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

  hasImagesDropZoneOver: boolean = false;
  hasThumbnailDropZoneOver: boolean = false;

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

  @ViewChild('name',{read: ElementRef}) nameInput : ElementRef;

  @ViewChildren(NbContextMenuDirective) contextMenus;

  @Input()
  mode: EntityFormMode = EntityFormMode.create;

  @Input()
  set originalViewPoint(viewPoint: IViewPointBiz) {
    if (viewPoint.id == '') {
      viewPoint.id = new ObjectID().toHexString();
    }
    this._originalViewPoint = viewPoint;
    this.newViewPoint = JSON.parse(JSON.stringify(this._originalViewPoint))
  }

  @Input()
  title: string = 'Create View Point';

  //#endregion

  //#region Constructor

  constructor(private _viewPointService: ViewPointService, private modalService: NgbModal, private element: ElementRef,
    public selectorService: SelectorService,
    private toasterService: ToasterService, private menuService: NbMenuService,
    private activeModal: NgbActiveModal) {
    this._imageFiles = new Map<string, FileItem>();

    this.imagesUploader.clearQueue();
    this.imagesUploader.setOptions({ allowedMimeType: ['image/png'] });

    this.thumbnailUploader.clearQueue();
    this.thumbnailUploader.setOptions({ allowedMimeType: ['image/png'] });

    this.filesMap.set('images',this.imagesUploader);
    this.filesMap.set('thumbnail',this.thumbnailUploader);

    this.menuService.onItemClick().subscribe(menuBag => {
      if (this.newViewPoint == null) return;

      let { file, source } = menuBag.item.data;

      if (file) {
        this.imagesUploader.removeFromQueue(file);
      }
      let index = this.newViewPoint.images.findIndex((img) => {
        return img === source;
      });
      if (index !== -1)
        this.newViewPoint.images.splice(index, 1);

      this.contextMenus.forEach(element => {
        element.hide();
      });
    })
  }

  //#endregion

  //#region Public method
  compareCityFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  getMenuItem(img: string): NbMenuItem[] {
    let fileItem = this._imageFiles.get(img);

    return [{
      title: 'Delete',
      data: { file: fileItem, source: img }
    }];
  }

  getClientHeight() {
    return this.element.nativeElement.clientHeight;
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
    return !this.isChanged() || !form.valid || (this.newViewPoint.images.length == 0);
  }

  imageFileOver(e: boolean): void {
    this.hasImagesDropZoneOver = e;
  }

  thumbnailFileOver(e: boolean): void {
    this.hasThumbnailDropZoneOver = e;
  }

  imageFileDropped(fileItems: FileItem[]): void {
    let reader = new FileReader();

    reader.onloadend = (e: any) => {
      this.newViewPoint.images.push(e.target.result);
      fileItems.forEach(item => {
        this._imageFiles.set(e.target.result, item);
      })
    }

    reader.readAsDataURL(fileItems[0]._file)
  }

  thumbnailFileDropped(fileItems: FileItem[]): void {
    let reader = new FileReader();

    reader.onloadend = (e: any) => {
      this.newViewPoint.thumbnail = e.target.result;
      this._thumbnailFile = fileItems[0];
    }

    reader.readAsDataURL(fileItems[0]._file)
  }

  action() {
    this.newViewPoint.images = this.newViewPoint.images.filter(img => {
      return !img.startsWith('data:');
    })

    this.newViewPoint.thumbnail = '';

    if (this.mode == EntityFormMode.create) {
      this._viewPointService.addViewPoint(this.newViewPoint,this.filesMap )
        .subscribe((ret: Error | IViewPoint) => {
          if (ret instanceof Error)
            this.toasterService.pop('error', 'Error', `Can't create view point, pls try later`);
          else
            this.toasterService.pop('success', 'Success', `View Point ${this.newViewPoint.name} created`);
          this.activeModal.close()
        });
    }
    else {
      this._viewPointService.updateViewPoint(this.newViewPoint,this.filesMap)
        .subscribe((ret: Error | IViewPoint) => {
          if (ret instanceof Error)
            this.toasterService.pop('error', 'Error', `Can't edit city, pls try later`);
          else
            this.toasterService.pop('success', 'Success', `View Point ${this.newViewPoint.name} edited`);
          this.activeModal.close()
        })
    }
  }

  close() {
    this.activeModal.close();
  }

  openMap() {
    const activeModal = this.modalService.open(MapModalComponent, { backdrop: false, size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.minHeight = 500;
    activeModal.componentInstance.city = this.newViewPoint.city;

    this.element.nativeElement.style.display = 'none';

    if (this.newViewPoint.latitude)
      activeModal.componentInstance.pointChoosed = new AMap.LngLat(this.newViewPoint.longtitude, this.newViewPoint.latitude);
    activeModal.result.then((pos: AMap.LngLat) => {
      this.newViewPoint.latitude = pos.getLat();
      this.newViewPoint.longtitude = pos.getLng();
      this.element.nativeElement.style.display = 'block';
      this.element.nativeElement.ownerDocument.body.classList.add('modal-open');
    }, (cancel) => {
      this.element.nativeElement.style.display = 'block';
      this.element.nativeElement.ownerDocument.body.classList.add('modal-open');
    });
  }

  //#endregion

  //#region Private method  

  private isChanged(): boolean {
    if (this.mode === EntityFormMode.create) return true;

    let changed = !(this.newViewPoint.name == this._originalViewPoint.name &&
      this.newViewPoint.city.id == this._originalViewPoint.city.id &&
      this.newViewPoint.category.id == this._originalViewPoint.category.id &&
      this.newViewPoint.address == this._originalViewPoint.address &&
      this.newViewPoint.description == this._originalViewPoint.description &&
      this.newViewPoint.latitude == this._originalViewPoint.latitude &&
      this.newViewPoint.longtitude == this._originalViewPoint.longtitude &&
      this.newViewPoint.rank == this._originalViewPoint.rank &&
      this.newViewPoint.tags == this._originalViewPoint.tags &&
      this.newViewPoint.timeNeeded == this._originalViewPoint.timeNeeded &&
      this.newViewPoint.tips == this._originalViewPoint.tips &&
      this.newViewPoint.thumbnail == this._originalViewPoint.thumbnail &&
      this.newViewPoint.images.length == this._originalViewPoint.images.length)

    if (changed) return changed;

    for (let i = 0; i < this.newViewPoint.images.length; i++) {
      if (this.newViewPoint.images[i] != this._originalViewPoint.images[i])
        return true;
    }

    return false;
  }
}
