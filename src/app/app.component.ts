import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';

import { CityPickPage } from '../pages/city-pick/city-pick.page';
//import { ViewPointsPage } from '../pages/view-points/view-points';
//import { TestPage } from '../pages/test/test.page';
//import { HomePage } from '../pages/home/home.page';

@Component({
  templateUrl: 'app.page.html'
})
export class App {
  //rootPage:any = ViewPointsPage;
  //rootPage:any =  TestPage;
  rootPage:any = CityPickPage;
  //rootPage:any =  HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

