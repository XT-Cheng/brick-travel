import { Component, Inject, Input, ViewChildren, ElementRef } from '@angular/core';
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
import { AMapComponent } from 'shared/@core/a-map/components/a-map.component';

@Component({
  selector: 'bt-vp-form',
  templateUrl: 'viewPoint.form.component.html',
  styleUrls: ['./viewPoint.form.component.scss']
})
export class ViewPointFormComponent {
  //#region Private member

  private _originalViewPoint: IViewPointBiz = null;
  private _files: Map<string, FileItem>;
  //#endregion

  //#region Public member
  items = [{
    title: 'Delete'
  }];

  hasBaseDropZoneOver: boolean = false;

  //#endregion

  //#region Public property
  newViewPoint: IViewPointBiz = null;
  selectedCity : any = null;
  
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

  constructor(private _viewPointService: ViewPointService,private modalService: NgbModal, private element : ElementRef,
    @Inject(FILE_UPLOADER) public uploader: FileUploader, 
    public selectorService : SelectorService,
    private toasterService: ToasterService, private menuService: NbMenuService,
    private activeModal: NgbActiveModal) {
    this._files = new Map<string, FileItem>();

    this.uploader.clearQueue();
    this.uploader.setOptions({ allowedMimeType: ['image/png'] });

    this.menuService.onItemClick().subscribe(menuBag => {
      if (this.newViewPoint == null) return;

      let { file, source } = menuBag.item.data;

      if (file) {
        this.uploader.removeFromQueue(file);
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
  compareCityFn(c1: ICityBiz, c2: ICityBiz): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  getMenuItem(img: string): NbMenuItem[] {
    let fileItem = this._files.get(img);

    return [{
      title: 'Delete',
      data: { file: fileItem, source: img }
    }];
  }

  hasFile(): boolean {
    return this.newViewPoint.images.length > 0;
  }

  isSubmitDisAllowed(form): boolean {
    return !this.isChanged() || !form.valid || (this.newViewPoint.images.length == 0);
  }

  fileOverBase(e: boolean): void {
    this.hasBaseDropZoneOver = e;
  }

  fileDropped(fileItems: FileItem[]): void {
    let reader = new FileReader();

    reader.onloadend = (e: any) => {
      this.newViewPoint.images.push(e.target.result);
      fileItems.forEach(item => {
        this._files.set(e.target.result, item);
      })
    }

    reader.readAsDataURL(fileItems[0]._file)
  }

  action() {
    this.newViewPoint.images = this.newViewPoint.images.filter(img => {
      return !img.startsWith('data:');
    })

    if (this.mode == EntityFormMode.create) {
      this._viewPointService.addViewPoint(this.newViewPoint)
        .subscribe((ret: Error | IViewPoint) => {
          if (ret instanceof Error)
            this.toasterService.pop('error', 'Error', `Can't create view point, pls try later`);
          else
            this.toasterService.pop('success', 'Success', `View Point ${this.newViewPoint.name} created`);
          this.activeModal.close()
        });
    }
    else {
      this._viewPointService.updateViewPoint(this.newViewPoint)
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
    const activeModal = this.modalService.open(AMapComponent, { backdrop: false, size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.minHeight = this.element.nativeElement.clientHeight;
    activeModal.componentInstance.allowSelectPoint = true;
  }

  //#endregion

  //#region Private method  

  private isChanged(): boolean {
    let changed = !(this.newViewPoint.name == this._originalViewPoint.name &&
      this.newViewPoint.city.id == this._originalViewPoint.city.id && 
      this.newViewPoint.images.length == this._originalViewPoint.images.length)

    if (changed) return changed;

    for (let i = 0 ; i < this.newViewPoint.images.length ; i ++) {
      if (this.newViewPoint.images[i] != this._originalViewPoint.images[i])
        return true;
    }

    return false;
  }
}
