import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AMapComponent } from '../components/a-map/a-map.component';
import { InformationWindowComponent } from '../components/a-map/information-window/information-window.component';
import { RateComponent } from '../components/a-map/rate/rate.component';
import { ViewPointMarkerComponent } from '../components/a-map/viewpoint-marker/viewpoint-marker.component';
import { TravelAgendaListComponent } from '../components/travel-agenda-list/travel-agenda-list.component';
import { TravelAgendaComponent } from '../components/travel-agenda/travel-agenda.component';
import { ViewPointDetailComponent } from '../components/viewpoint-detail/viewpoint-detail';
import { ViewPointFilterComponent } from '../components/viewpoint-filter/viewpoint-filter.component';
import { ViewPointListComponent } from '../components/viewpoint-list/viewpoint-list.component';
import { ViewPointSearchComponent } from '../components/viewpoint-search/viewpoint-search.component';
import { DragulaDirective } from '../directives/dragula.directive';
import { CityPickPage } from '../pages/city-pick/city-pick.page';
import { HomePage } from '../pages/home/home.page';
import { TestPage } from '../pages/test/test.page';
import { TravelAgendaListPage } from '../pages/travel-agenda-list/travel-agenda-list.page';
import { TravelAgendaPage } from '../pages/travel-agenda/travel-agenda.page';
import { ViewPointPage } from '../pages/view-point/view-point.page';
import { ViewPointsListPage } from '../pages/view-points-list/view-points-list.page';
import { ViewPointsSelectPage } from '../pages/view-points-select/view-points-select.page';
import { App } from './app.component';
import { StoreModule } from 'shared/@core/store/store.module';
import { FileUploadModule } from 'shared/@core/fileUpload/fileUpload.module';

@NgModule({
  declarations: [
    App,
    AMapComponent,
    ViewPointMarkerComponent,
    InformationWindowComponent,
    TestPage,
    HomePage,
    ViewPointPage,
    RateComponent,
    ViewPointFilterComponent,
    ViewPointSearchComponent,
    ViewPointListComponent,
    ViewPointDetailComponent,
    TravelAgendaComponent,
    TravelAgendaListComponent,
    DragulaDirective,
    ViewPointsListPage,
    TravelAgendaListPage,
    ViewPointsSelectPage,
    TravelAgendaPage,
    CityPickPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(),
    IonicModule.forRoot(App),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    App,
    TestPage,
    HomePage,
    ViewPointPage,
    ViewPointsListPage,
    ViewPointsSelectPage,
    TravelAgendaPage,
    CityPickPage,
    TravelAgendaListPage,
    ViewPointMarkerComponent,
    InformationWindowComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
