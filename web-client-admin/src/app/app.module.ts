import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicStorageModule } from '@ionic/storage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../environments/environment';
import { AuthModule } from './@core/auth/auth.module';
import { FileUploadModule } from './@core/fileUpload/fileUpload.module';
import { StoreModule } from './@core/store/store.module';
import { WEBAPI_HOST } from './@core/utils/constants';
import { UIModule } from './@ui/ui.module';
import { AppComponent } from './app.component';
import { PageComponent } from './page.component';
import { TestComponent } from './test.component';

const DELCARATIONS = [
  AppComponent,
  PageComponent,
  TestComponent
];

const BOOTSTRAPS = [
  AppComponent
];

@NgModule({
  declarations: [
    ...DELCARATIONS
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(),
    AuthModule.forRoot(),
    NgbModule.forRoot(),
    UIModule.forRoot(),
    FileUploadModule.forRoot({url: `${WEBAPI_HOST}/fileUpload`}),
  ],
  providers: [],
  bootstrap: [
    ...BOOTSTRAPS
  ]
})
export class AppModule { }
