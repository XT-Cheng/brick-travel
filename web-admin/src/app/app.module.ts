import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { NB_AUTH_TOKEN_CLASS, NbAuthJWTToken, NbTokenStorage } from '@nebular/auth';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from './@core/core.module';
import { TokenCustomLocalStorage } from './@core/tokenLocalStorage';
import { ThemeModule } from './@theme/theme.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from './store/store.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    StoreModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: NB_AUTH_TOKEN_CLASS, useValue: NbAuthJWTToken },
    { provide: NbTokenStorage, useClass: TokenCustomLocalStorage },
  ],
})
export class AppModule {
}
