import { CommonModule } from '@angular/common';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';

import { FileDropDirective } from './directives/file-drop.directive';
import { FileSelectDirective } from './directives/file-select.directive';
import { FileUploader, FileUploaderOptions } from './providers/file-uploader';

export const FILE_UPLOADER = new InjectionToken('File Uploader');
export const FILE_UPLOADER_OPTIONS = new InjectionToken('File Uploader Options');

export function fileUploaderFactory(fileUploadOpt: FileUploaderOptions) {
  return new FileUploader(fileUploadOpt);
}

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FileSelectDirective,
    FileDropDirective
  ],
  declarations: [
    FileSelectDirective,
    FileDropDirective
  ]
})
export class FileUploadModule {
  static forRoot(fileUploadOpt: FileUploaderOptions): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: FileUploadModule,
      providers: [
        { provide: FILE_UPLOADER_OPTIONS, useValue: fileUploadOpt },
        { provide: FILE_UPLOADER, useFactory: fileUploaderFactory, deps: [FILE_UPLOADER_OPTIONS] }
      ],
    };
  }
}
