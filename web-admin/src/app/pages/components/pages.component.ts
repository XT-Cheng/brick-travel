import { Component, ViewChild, AfterViewInit, ComponentRef } from '@angular/core';

import { MENU_ITEMS } from '../pages-menu';
import { Type } from '@angular/compiler/src/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export interface ComponentType {
  createEntity();
}

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-two-columns-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet (activate)="onActivate($event)"></router-outlet>
      <div style='position: fixed;'>
        <nb-card class='action-buttons-card'>
          <nb-card-body>
              <div class='action-buttons-div'>
                  <button type="button" (click)='newEntity()' class="btn btn-primary btn-icon">
                    <i class="nb-plus"></i>
                  </button>
                  <button type="button" class="btn btn-success btn-icon">
                    <i class="nb-skip-backward-outline"></i>
                  </button>
                  <button type="button" class="btn btn-danger btn-icon">
                    <i class="nb-skip-forward-outline"></i>
                  </button>
                </div>
          </nb-card-body>
        </nb-card>
        </div>
    </ngx-two-columns-layout>
  `,
  styleUrls: [`./pages.component.scss`]
})
export class PagesComponent{
  private createCmp : ComponentType;

  constructor(private modalService: NgbModal) {

  }

  onActivate(comp : ComponentType) {
    this.createCmp = comp;
  }
  
  newEntity() {
    this.createCmp.createEntity();
  }
  
  menu = MENU_ITEMS;
}