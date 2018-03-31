import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, MenuController } from 'ionic-angular';

import { AuthService } from 'shared/@core/auth/providers/authService';
import { AuthResult } from 'shared/@core/auth/providers/authResult';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  redirectDelay: number = 0;
  showMessages: any = {};
  provider: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;

  constructor(protected service: AuthService,
    public navCtrl: NavController,
    public menu: MenuController,) {
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }
  
  signup() {

  }

  login(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service.authenticate(this.user).subscribe((result: AuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          this.navCtrl.setRoot(HomePage);
      })
    }});
  }
}
