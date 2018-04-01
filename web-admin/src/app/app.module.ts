import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { NbAuthModule } from '@nebular/auth';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthModule } from 'shared/@core/auth/auth.module';
import { FileUploadModule } from 'shared/@core/fileUpload/fileUpload.module';
import { WEBAPI_HOST } from 'shared/@core/utils/constants';
import { UIModule } from './@ui/ui.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from 'shared/@core/store/store.module';
import { PageComponent } from './page.component';
import { PageRoutingGuard } from './page-routing-guard';
import { AppRoutingGuard } from './app-routing-guard';

@NgModule({
  declarations: [AppComponent,PageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    NbAuthModule.forRoot(),
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(),
    AuthModule.forRoot(),
    AppRoutingModule,
    NgbModule.forRoot(),
    UIModule.forRoot(),
    FileUploadModule.forRoot({url: `${WEBAPI_HOST}/fileUpload`})
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },PageRoutingGuard,AppRoutingGuard
  ],
})
export class AppModule {
}
