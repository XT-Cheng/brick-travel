import { Component } from '@angular/core';

// TODO: move layouts into the framework
@Component({
  selector: 'bt-two-columns-layout',
  styleUrls: ['./two-columns.layout.scss'],
  template: `
    <nz-layout>
      <bt-header class='header'></bt-header>
      <bt-sidebar class="aside"></bt-sidebar>
      <bt-footer></bt-footer>
    </nz-layout>
  `,
})
export class TwoColumnsLayoutComponent {
}

// <nz-sider class="menu-sidebar" tag="menu-sidebar" responsive >
// <ng-content select="nb-menu"></ng-content>
// </nz-sider>

// <nz-content>
// <ng-content select="router-outlet"></ng-content>
// </nz-content>
