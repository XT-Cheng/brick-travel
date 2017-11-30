import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AMapComponent } from '../components/a-map/a-map.component';
import { InformationWindowComponent } from '../components/a-map/information-window/information-window.component';
import { RateComponent } from '../components/a-map/rate/rate.component';
import { ViewPointMarkerComponent } from '../components/a-map/viewpoint-marker/viewpoint-marker.component';
import { TravelAgendaComponent } from '../components/travel-agenda/travel-agenda.component';
import { ViewPointFilterComponent } from '../components/viewpoint-filter/viewpoint-filter.component';
import { ViewPointListComponent } from '../components/viewpoint-list/viewpoint-list.component';
import { ViewPointSearchComponent } from '../components/viewpoint-search/viewpoint-search.component';
import { DragulaDirective } from '../directives/dragula.directive';
import { StoreModule } from '../modules/store/store.module';
import { HomePage } from '../pages/home/home.page';
import { DragulaService } from '../providers/dragula.service';
import { App } from './app.component';
import { ViewPointsPage } from '../pages/view-points/view-points';
import { CityPickPage } from '../pages/city-pick/city-pick.page';

@NgModule({
  declarations: [
    App,
    AMapComponent,
    ViewPointMarkerComponent,
    InformationWindowComponent,
    HomePage,
    RateComponent,
    ViewPointFilterComponent,
    ViewPointSearchComponent,
    ViewPointListComponent,
    TravelAgendaComponent,
    DragulaDirective,
    ViewPointsPage,
    CityPickPage
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
    ViewPointsPage,
    CityPickPage,
    ViewPointMarkerComponent,
    InformationWindowComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DragulaService
  ]
})
export class AppModule {}
