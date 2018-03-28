import { CommonModule } from '@angular/common';
import { InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FileUploader, FileUploaderOptions } from './providers/file-uploader';
import { WEBAPI_HOST } from '../utils/constants';
import { throwIfAlreadyLoaded } from '../utils/module-import-guard';
import { FileSelectDirective } from './directives/file-select.directive';
import { FileDropDirective } from './directives/file-drop.directive';

export const FILE_UPLOADER = new InjectionToken('File Uploader');
export const FILE_UPLOADER_OPTIONS = new InjectionToken('File Uploader Options');

export function fileUploaderFactory(fileUploadOpt : FileUploaderOptions) {
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
  declarations: [FileSelectDirective,FileDropDirective]
})
export class FileUploadModule {
  static forRoot(fileUploadOpt : FileUploaderOptions): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: FileUploadModule,
      providers: [
        {provide: FILE_UPLOADER_OPTIONS, useValue: fileUploadOpt},
        { provide: FILE_UPLOADER, useFactory: fileUploaderFactory, deps: [FILE_UPLOADER_OPTIONS] }
      ],
    };
  }
}
