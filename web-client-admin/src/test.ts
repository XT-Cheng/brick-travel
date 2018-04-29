import 'zone.js/dist/zone-testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { IonicStorageModule } from '@ionic/storage';

import { AuthModule } from './app/@core/auth/auth.module';
import { FileUploadModule } from './app/@core/fileUpload/fileUpload.module';
import { StoreModule } from './app/@core/store/store.module';
import { WEBAPI_HOST } from './app/@core/utils/constants';

// This file is required by karma.conf.js and loads recursively all the .spec and framework files

export function initTest() {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      IonicStorageModule.forRoot(),
      AuthModule.forRoot(),
      StoreModule.forRoot(),
      FileUploadModule.forRoot({ url: `${WEBAPI_HOST}/fileUpload` })
    ]
  });
}

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
