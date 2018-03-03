import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-two-columns-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
      <div style='position: fixed;'>
        <nb-card class='action-buttons-card'>
          <nb-card-body>
              <div class='action-buttons-div'>
                  <button type="button" class="btn btn-primary btn-icon">
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
export class PagesComponent {

  menu = MENU_ITEMS;
}
