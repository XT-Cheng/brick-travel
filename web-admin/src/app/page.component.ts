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
  selector: 'ngx-page',
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
  styleUrls: [`./page.component.scss`]
})
export class PageComponent implements OnInit {
  private cityMenuItem = {
    title: 'City',
    icon: 'nb-home',
    link: '/city'
  }

  private viewPointMenuItem = {
    title: 'View Point',
    icon: 'nb-home',
    children: []
  }

  menu: NbMenuItem[] = [this.cityMenuItem, this.viewPointMenuItem];

  ngOnInit(): void {

  }

  config: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    timeout: 2000,
    newestOnTop: true,
    tapToDismiss: true,
    preventDuplicates: true,
    animation: 'fade',
    limit: 5,
  });

  private createCmp: ComponentType;

  constructor(private route: ActivatedRoute, private modalService: NgbModal,
    private router: Router, private _selectorService: SelectorService) {

    this._selectorService.cities$.subscribe(cities => {
      cities.forEach((city) => {
        this.viewPointMenuItem.children.push({
          title: city.name,
          icon: 'nb-home'
        })
      })
    })
  }

  onActivate(comp: ComponentType) {
    this.createCmp = comp;
  }

  newEntity() {
    this.createCmp.createEntity();
  }
}
