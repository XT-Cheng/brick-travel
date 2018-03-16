import { Component, ViewChild, AfterViewInit, ComponentRef, OnInit } from '@angular/core';

import { MENU_ITEMS } from './admin-menu';
import { Type } from '@angular/compiler/src/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NavigationEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
import { LOCATION_INITIALIZED } from '@angular/common';
import { ToasterConfig } from 'angular2-toaster';

export interface ComponentType {
  createEntity();
}

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-two-columns-layout>
      <nb-menu [items]="menu"></nb-menu>
      <toaster-container [toasterconfig]="config"></toaster-container>
      <router-outlet (activate)="onActivate($event)"></router-outlet>
      <div style='position: fixed;'>
        <nb-card class='action-buttons-card'>
          <nb-card-body>
              <div class='action-buttons-div'>
                  <button type="button" (click)='newEntity()' class="btn btn-primary btn-icon">
                    <i class="nb-plus"></i>
                  </button>
                </div>
          </nb-card-body>
        </nb-card>
        </div>
    </ngx-two-columns-layout>
  `,
  styleUrls: [`./admin.component.scss`]
})
export class AdminComponent {
  config : ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    timeout: 2000,
    newestOnTop: true,
    tapToDismiss: true,
    preventDuplicates: true,
    animation: 'fade',
    limit: 5,
  });
  
  private createCmp : ComponentType;

  constructor(private route : ActivatedRoute,private modalService: NgbModal,private router : Router) {
  }

  onActivate(comp : ComponentType) {
    this.createCmp = comp;
  }
  
  newEntity() {
    this.createCmp.createEntity();
  }
  
  menu = MENU_ITEMS;
}