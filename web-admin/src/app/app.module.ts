import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { NbAuthModule } from '@nebular/auth';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthModule } from './@core/auth/auth.module';
import { FileUploadModule } from './@core/fileUpload/fileUpload.module';
import { WEBAPI_HOST } from './@core/utils/constants';
import { ThemeModule } from './@theme/theme.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from './@core/store/store.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    AuthModule.forRoot(),
    AppRoutingModule,
    NbAuthModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    FileUploadModule.forRoot({url: `${WEBAPI_HOST}/fileUpload`}),
    StoreModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
})
export class AppModule {
}
