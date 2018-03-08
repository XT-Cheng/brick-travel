import { ModuleWithProviders, NgModule, Optional, SkipSelf, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbDummyAuthProvider, NbEmailPassAuthProvider } from '@nebular/auth';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataModule } from './data/data.module';
import { HttpResponse } from '@angular/common/http';
import { WEBAPI_HOST } from '../store/utils/constants';
import { CustomAuthProvider } from './custom-auth.provider';
import { FileUploader } from 'ng2-file-upload';

export const FILE_UPLOADER = new InjectionToken('Nebular Auth Options');

const formSetting: any = {
  provider: 'custom',
  redirectDelay: 0,
  showMessages: {
    success: true,
  },
};

const NB_CORE_PROVIDERS = [
  CustomAuthProvider,
  ...DataModule.forRoot().providers,
  ...NbAuthModule.forRoot({
    providers: {
      custom: {
        service: CustomAuthProvider,
        config: {
          delay: 3000,
          baseEndpoint: WEBAPI_HOST,
          login: {
            rememberMe: true,
            endpoint: '/auth/login',
            method: 'post'
          },
          token: {
            key: 'idToken'
          },
          errors: {
            key: 'errors'
          }
        },
      },
    },
    forms: {
      login: formSetting,
      register: formSetting,
      requestPassword: formSetting,
      resetPassword: formSetting,
      logout: formSetting
    }
  }).providers,
  { provide: FILE_UPLOADER, useFactory: fileUploaderFactory },
];

export function fileUploaderFactory() {
  return new FileUploader({url: `${WEBAPI_HOST}/fileUpload`});
}

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
