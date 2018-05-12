import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { ToasterConfig } from 'angular2-toaster';

import { CityService } from './@core/store/providers/city.service';

export interface ComponentType {
  createEntity();
}

export enum EntityFormMode {
  create,
  edit
}

@Component({
  selector: 'bt-page',
  template: `
    <bt-two-columns-layout>
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
  </bt-two-columns-layout>
`,
  styleUrls: [`./page.component.scss`]
})
export class PageComponent {
  //#region Private members
  private testMenuItem = {
    title: 'Test',
    icon: 'nb-home',
    link: '/test'
  };

  private cityMenuItem = {
    title: 'City',
    icon: 'nb-home',
    link: 'city'
  };

  private viewPointMenuItem = {
    title: 'View Point',
    icon: 'nb-home',
    children: []
  };

  private travelAgendaMenuItem = {
    title: 'Travel Agenda',
    icon: 'nb-home',
    link: 'travelAgenda'
  };

  private createCmp: ComponentType;

  //#endregion

  //#region Public members

  menu: NbMenuItem[] = [this.testMenuItem, this.cityMenuItem, this.viewPointMenuItem, this.travelAgendaMenuItem];

  config: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    timeout: 2000,
    newestOnTop: true,
    tapToDismiss: true,
    preventDuplicates: true,
    animation: 'fade',
    limit: 5,
  });

  //#endregion

  //#region Interface implementation

  //#endregion

  //#region Constructor

  constructor(private _cityservice: CityService) {

    this._cityservice.all$.subscribe(cities => {
      cities.forEach((city) => {
        this.viewPointMenuItem.children.push({
          title: city.name,
          link: `viewPoint/${city.id}`,
          icon: 'nb-home'
        });
      });
    });
  }

  //#endregion

  //#region Pubic methods
  onActivate(comp: ComponentType) {
    this.createCmp = comp;
  }

  newEntity() {
    this.createCmp.createEntity();
  }
}
//#endregion
