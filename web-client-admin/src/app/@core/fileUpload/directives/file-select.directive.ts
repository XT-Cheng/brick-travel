import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { FileUploader } from '../providers/file-uploader';

@Directive({ selector: '[btFileSelect]' })
export class FileSelectDirective {
  @Input() public uploader: FileUploader;
  @Output() public fileSelected: EventEmitter<File[]> = new EventEmitter<File[]>();

  protected element: ElementRef;

  public constructor(element: ElementRef) {
    this.element = element;
  }

  public getOptions(): any {
    return this.uploader.options;
  }

  public getFilters(): any {
    return {};
  }

  public isEmptyAfterSelection(): boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }

  @HostListener('change')
  public onChange(): any {
    const files = this.element.nativeElement.files;
    const options = this.getOptions();
    const filters = this.getFilters();

    this.uploader.addToQueue(files, options, filters);
    this.fileSelected.emit(files);

    if (this.isEmptyAfterSelection()) {
      this.element.nativeElement.value = '';
    }
  }
}
