/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { getDeepFromObject } from 'shared/@core/utils/helpers';
import { AuthService } from 'shared/@core/auth/providers/authService';
import { AuthResult } from 'shared/@core/auth/providers/authResult';
import { REDIRECT_DELAY, SOCIAL_LINKS } from 'shared/@core/utils/constants';

export interface AuthSocialLink {
  link?: string,
  url?: string,
  target?: string,
  title?: string,
  icon?: string,
}

@Component({
  selector: 'bt-login',
  template: `
    <bt-auth-block>
      <h2 class="title">Sign In</h2>
      <small class="form-text sub-title">Hello! Sign in with your User Name</small>

      <form (ngSubmit)="login()" #form="ngForm" autocomplete="nope">

        <div *ngIf="errors && errors.length > 0 && !submitted"
             class="alert alert-danger" role="alert">
          <div><strong>Oh snap!</strong></div>
          <div *ngFor="let error of errors">{{ error }}</div>
        </div>

        <div *ngIf="messages && messages.length > 0 && !submitted"
             class="alert alert-success" role="alert">
          <div><strong>Hooray!</strong></div>
          <div *ngFor="let message of messages">{{ message }}</div>
        </div>

        <div class="form-group">
          <label for="input-username" class="sr-only">User name</label>
          <input name="username" [(ngModel)]="user.username" id="input-username"
                 class="form-control" placeholder="User name" #username="ngModel"
                 [class.form-control-danger]="username.invalid && username.touched" bt-autofocus
                 required>
          <small class="form-text error" *ngIf="username.invalid && username.touched && username?.errors?.required">
            User Name is required!
          </small>
        </div>

        <div class="form-group">
          <label for="input-password" class="sr-only">Password</label>
          <input name="password" [(ngModel)]="user.password" type="password" id="input-password"
                 class="form-control" placeholder="Password" #password="ngModel"
                 [class.form-control-danger]="password.invalid && password.touched"
                 required>
          <small class="form-text error" *ngIf="password.invalid && password.touched && password?.errors?.required">
            Password is required!
          </small>
        </div>

        <div class="form-group accept-group col-sm-12">
          <nb-checkbox name="rememberMe" [(ngModel)]="user.rememberMe">Remember me</nb-checkbox>
          <a class="forgot-password" routerLink="../request-password">Forgot Password?</a>
        </div>

        <button [disabled]="submitted || !form.valid" class="btn btn-block btn-hero-success"
                [class.btn-pulse]="submitted">
          Sign In
        </button>
      </form>

      <div class="links">

        <ng-container *ngIf="socialLinks && socialLinks.length > 0">
          <small class="form-text">Or connect with:</small>

          <div class="socials">
            <ng-container *ngFor="let socialLink of socialLinks">
              <a *ngIf="socialLink.link"
                 [routerLink]="socialLink.link"
                 [attr.target]="socialLink.target"
                 [attr.class]="socialLink.icon"
                 [class.with-icon]="socialLink.icon">{{ socialLink.title }}</a>
              <a *ngIf="socialLink.url"
                 [attr.href]="socialLink.url"
                 [attr.target]="socialLink.target"
                 [attr.class]="socialLink.icon"
                 [class.with-icon]="socialLink.icon">{{ socialLink.title }}</a>
            </ng-container>
          </div>
        </ng-container>

        <small class="form-text">
          Don't have an account? <a routerLink="../register"><strong>Sign Up</strong></a>
        </small>
      </div>
    </bt-auth-block>
  `,
})
export class LoginComponent {
  redirectDelay: number = 0;
  provider: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  socialLinks: AuthSocialLink[] = [];

  constructor(protected service: AuthService,protected router: Router) {
    this.redirectDelay = REDIRECT_DELAY;
    this.socialLinks = SOCIAL_LINKS;
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
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  }
}
