import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})
export class AdminApp {
  rootPage:any = LoginPage;

  appPages: PageInterface[] = [
    { title: 'Schedule', name: 'HomePage', component: HomePage, index: 0, icon: 'calendar' },
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
   platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page: PageInterface) {
  }

  isActive(page: PageInterface) {
    return 'primary';
  }
}