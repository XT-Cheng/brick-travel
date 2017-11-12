import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { App } from './app.component';
import { HomePage } from '../pages/home/home';
import { StoreModule } from '../modules/store/module';
import { AMapComponent } from '../components/a-map/a-map.component';
import { ViewPointMarkerComponent } from '../components/a-map/viewpoint-marker/viewpoint-marker.component';

@NgModule({
  declarations: [
    App,
    AMapComponent,
    ViewPointMarkerComponent,
    HomePage
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
    ViewPointMarkerComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
