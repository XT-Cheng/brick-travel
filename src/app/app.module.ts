import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { App } from './app.component';
import { HomePage } from '../pages/home/home.page';
import { StoreModule } from '../modules/store/store.module';
import { AMapComponent } from '../components/a-map/a-map.component';
import { ViewPointMarkerComponent } from '../components/a-map/viewpoint-marker/viewpoint-marker.component';
import { InformationWindowComponent } from '../components/a-map/information-window/information-window.component';
import { RateComponent } from '../components/a-map/rate/rate.component';
import { ViewPointFilterComponent } from '../components/viewpoint-filter/viewpoint-filter.component';
import { ViewPointSearchComponent } from '../components/viewpoint-search/viewpoint-search.component';

@NgModule({
  declarations: [
    App,
    AMapComponent,
    ViewPointMarkerComponent,
    InformationWindowComponent,
    HomePage,
    RateComponent,
    ViewPointFilterComponent,
    ViewPointSearchComponent
  ],
  imports: [
    BrowserModule,
    StoreModule,
    IonicModule.forRoot(App)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    App,
    HomePage,
    ViewPointMarkerComponent,
    InformationWindowComponent,
    ViewPointFilterComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
