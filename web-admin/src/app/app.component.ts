import { Component, OnInit } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectorService } from './@core/store/providers/selector.service';
import { NbMenuItem } from '@nebular/theme';

export interface ComponentType {
  createEntity();
}

export enum EntityFormMode {
  create,
  edit
}

@Component({
  selector: 'ngx-app',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: [`./app.component.scss`]
})
export class AppComponent {
}
