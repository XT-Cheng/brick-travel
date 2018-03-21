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
import { UIModule } from './@ui/ui.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from './@core/store/store.module';
import { PageComponent } from './page.component';
import { PageRoutingGuard } from './page-routing-guard';
import { AppRoutingGuard } from './app-routing-guard';

@NgModule({
  declarations: [AppComponent,PageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    AuthModule.forRoot(),
    AppRoutingModule,
    NbAuthModule,
    NgbModule.forRoot(),
    UIModule.forRoot(),
    FileUploadModule.forRoot({url: `${WEBAPI_HOST}/fileUpload`}),
    StoreModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },PageRoutingGuard,AppRoutingGuard
  ],
})
export class AppModule {
}
