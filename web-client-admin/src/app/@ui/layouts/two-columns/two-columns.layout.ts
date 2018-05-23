import { Component } from '@angular/core';

// TODO: move layouts into the framework
@Component({
  selector: 'bt-two-columns-layout',
  styleUrls: ['./two-columns.layout.scss'],
  template: `
    <nz-layout>
      <nz-header fixed>
        <bt-header></bt-header>
      </nz-header>

      <nz-layout>
        <nz-sider class="menu-sidebar" tag="menu-sidebar" responsive >
          <ng-content select="nb-menu"></ng-content>
        </nz-sider>

        <nz-content>
          <ng-content select="router-outlet"></ng-content>
        </nz-content>
      </nz-layout>

      <nz-footer>
        <bt-footer></bt-footer>
      </nz-footer>
    </nz-layout>
  `,
})
export class TwoColumnsLayoutComponent {
}
